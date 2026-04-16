import pandas as pd
from loguru import logger
import re

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
    
    # Drop strict duplicates
    df = df.drop_duplicates()
    
    # Normalize col names
    df = normalize_column_names(df)
    
    # Handle missing values
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            # Simple imputation: mean for numeric
            df[col] = df[col].fillna(df[col].mean())
        else:
            # Mode for categorical
            mode_val = df[col].mode()
            if not mode_val.empty:
                df[col] = df[col].fillna(mode_val[0])
            else:
                df[col] = df[col].fillna("Unknown")
                
    # Detect dates
    df = parse_date_columns(df)
    
    logger.info(f"Dataset cleaned. Transformed {initial_shape} -> {df.shape}")
    return df