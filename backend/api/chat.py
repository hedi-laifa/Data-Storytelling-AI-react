from fastapi import APIRouter, HTTPException
from loguru import logger

from schemas.api_schemas import ChatRequest, ChatResponse
from services.session_manager import get_dataset
from agents.data_agent import get_data_agent

router = APIRouter()

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):
    logger.info(f"Question received for session {request.dataset_id}: {request.question}")
    try:
        df = get_dataset(request.dataset_id)
        
        # Instantiate LangChain Agent
        agent = get_data_agent(df)
        
        # Execute query formatting
        prompt = f"Answer this question clearly and simply based on the dataframe: {request.question}"
        
        response = agent.invoke(prompt)
        output_text = response.get("output", "I don't have enough data to answer that.")
        
        return ChatResponse(
            answer=output_text,
            chart=None # Future upgrade: Detect generated python code for charts
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error querying data agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))