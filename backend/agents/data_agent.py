from langchain_openai import ChatOpenAI
from utils.config import settings

class FastDataAgent:
    def __init__(self, llm, df):
        self.llm = llm
        self.df = df
        
        # Precompute summary for one-shot prompt
        self.df_info = (
            f"Shape: {df.shape}\n"
            f"Columns: {', '.join(df.columns.astype(str))}\n"
            f"Sample Data (First 3 rows):\n{df.head(3).to_string()}\n"
            f"Data Summary:\n{df.describe(include='all').to_string()}"
        )

    def invoke(self, prompt):
        if isinstance(prompt, dict):
            prompt = prompt.get("input", str(prompt))
            
        full_prompt = f"""You are an expert data analyst.
Use the following summary of the dataset to answer the user's question accurately and concisely.

{self.df_info}

Question: {prompt}
"""
        response = self.llm.invoke(full_prompt)
        return {"output": response.content}

def get_data_agent(df):
    llm = ChatOpenAI(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        api_key=settings.XAI_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
    
    # Return our ultra-fast single-shot agent instead of the slow recursive ReAct agent
    return FastDataAgent(llm, df)
