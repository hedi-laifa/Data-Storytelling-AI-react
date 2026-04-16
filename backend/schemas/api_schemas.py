from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# --- Dataset Schemas ---

class UploadResponse(BaseModel):
    dataset_id: str
    rows: int
    columns: int
    column_names: List[str]
    message: str

class DatasetSummary(BaseModel):
    row_count: int
    column_count: int
    data_types: Dict[str, str]
    null_counts: Dict[str, int]
    numeric_columns: List[str]
    categorical_columns: List[str]
    sample_rows: List[Dict[str, Any]]

# --- Analysis & Charts ---

class ChartConfig(BaseModel):
    title: str
    explanation: str
    variables_used: List[str]
    config: Dict[str, Any]
    plotly_json: Optional[Any] = None

class StorytellingReport(BaseModel):
    executive_summary: str
    key_insights: List[str]
    trends: List[str]
    anomalies: List[str]
    business_recommendations: List[str]

# --- Chat ---

class ChatRequest(BaseModel):
    dataset_id: str
    question: str

class ChatResponse(BaseModel):
    answer: str
    chart: Optional[ChartConfig] = None