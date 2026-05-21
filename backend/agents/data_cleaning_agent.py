import pandas as pd
from loguru import logger
import re
from langchain_openai import ChatOpenAI
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from utils.config import settings

def parse_date_columns(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.columns:
        if df[col].dtype == 'object':
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True)
            except (ValueError, TypeError):
                pass
    return df

def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [
        re.sub(r'[^A-Za-z0-9_]+', '', str(c).strip().replace(" ", "_").replace("-", "_").lower()) 
        for c in df.columns
    ]
    return df

def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Cleaning dataset...")
    initial_shape = df.shape
    
    # Drop strict duplicates and normalize
    df = df.drop_duplicates()
    df = normalize_column_names(df)
    
    try:
        logger.info("Starting Data Cleaning Agent (One-Shot)...")
        llm = ChatOpenAI(
            model="llama-3.3-70b-versatile",
            temperature=0.0,
            api_key=settings.XAI_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        
        df_info = f"Columns: {', '.join(df.columns)}\nData Types:\n{df.dtypes}\nMissing Values:\n{df.isnull().sum()}"
        
        prompt = f"""You are a precise Data Cleaning Agent writing Python code.
Analyze this dataframe `df` information:

{df_info}

Write ONLY valid Python code to:
1. Infer if any 'object' columns are actually dates and convert them to datetime in-place.
2. Fill missing values in-place (e.g., median for skewed numerical, mode for categorical).
Do NOT wrap the code in markdown tags like ```python, return JUST the code. 
Assume pandas is imported as pd and `df` is already available in the local scope. Use df.fillna() etc directly.
"""
        result = llm.invoke(prompt)
        code = result.content.strip()
        
        # Strip out markdown gracefully if the AI still provided it
        if code.startswith("```python"):
            code = code[9:]
        if code.startswith("```"):
            code = code[3:]
        if code.endswith("```"):
            code = code[:-3]
        
        # Execute the generated code on our dataframe
        exec(code.strip(), {"pd": pd, "df": df})
        logger.info("Agent cleaning successful.")
    except Exception as e:
        logger.warning(f"Agent cleaning failed, falling back to heuristics: {e}")
        # Handle missing values fallback
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].mean())
            else:
                mode_val = df[col].mode()
                if not mode_val.empty:
                    df[col] = df[col].fillna(mode_val[0])
                else:
                    df[col] = df[col].fillna("Unknown")
                    
        # Detect dates fallback
        df = parse_date_columns(df)
    
    logger.info(f"Dataset cleaned. Transformed {initial_shape} -> {df.shape}")
    return df