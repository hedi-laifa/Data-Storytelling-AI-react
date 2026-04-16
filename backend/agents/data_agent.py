from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_openai import ChatOpenAI
from utils.config import settings

def get_data_agent(df):
    # Using the XAI_API_KEY from settings to authenticate with groq explicitly
    llm = ChatOpenAI(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        api_key=settings.XAI_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
    
    agent = create_pandas_dataframe_agent(
        llm,
        df,
        verbose=True,
        allow_dangerous_code=True,
        prefix="You are an expert data analyst working with a Pandas dataframe.",
        handle_parsing_errors=True
    )
    
    return agent
