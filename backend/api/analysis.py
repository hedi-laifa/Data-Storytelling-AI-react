from fastapi import APIRouter, HTTPException
from loguru import logger
from typing import List

from schemas.api_schemas import ChartConfig, StorytellingReport
from services.session_manager import get_dataset
from services.chart_service import generate_charts
from services.storytelling_service import generate_storytelling_report

router = APIRouter()

@router.get("/{dataset_id}/charts", response_model=List[ChartConfig])
async def get_charts(dataset_id: str):
    logger.info(f"Generating charts for {dataset_id}")
    try:
        df = get_dataset(dataset_id)
        
        # Generation Logic
        charts = generate_charts(df)
        
        return charts
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating charts: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse chart generation")

@router.get("/{dataset_id}/storytelling-report", response_model=StorytellingReport)
async def get_storytelling_report(dataset_id: str):
    logger.info(f"Generating storytelling report for {dataset_id}")
    try:
        df = get_dataset(dataset_id)
        
        # Use LLM-generated detailed storytelling instead of simple mock
        report_dict = generate_storytelling_report(df)
        
        report = StorytellingReport(
            executive_summary=report_dict.get("executive_summary", "Detailed overview generated."),
            key_insights=report_dict.get("key_insights", ["Processed dataset attributes"]),
            trends=report_dict.get("trends", ["General operational flow"]),
            anomalies=report_dict.get("anomalies", ["Expected deviations captured"]),
            business_recommendations=report_dict.get("business_recommendations", ["Implement continuous monitoring"])
        )
        return report
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))