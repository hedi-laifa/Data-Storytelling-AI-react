from fastapi import APIRouter, UploadFile, File, HTTPException, status
from loguru import logger
import pandas as pd
import uuid
import io

from schemas.api_schemas import UploadResponse, DatasetSummary
from services.session_manager import save_dataset, get_dataset, reset_all_sessions
from services.data_service import clean_dataset

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Only .csv and .xlsx files are supported."
        )

    try:
        contents = await file.read()
        
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        # Clear previous active sessions to ensure isolation
        reset_all_sessions()
        
        # Clean Data (Data Cleaning Service)
        df_cleaned = clean_dataset(df)

        # Session Management
        dataset_id = str(uuid.uuid4())
        save_dataset(dataset_id, df_cleaned)

        logger.info(f"Dataset uploaded successfully: {dataset_id}")

        return UploadResponse(
            dataset_id=dataset_id,
            rows=df_cleaned.shape[0],
            columns=df_cleaned.shape[1],
            column_names=list(df_cleaned.columns),
            message="Dataset uploaded and cleaned successfully."
        )

    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dataset_id}/summary", response_model=DatasetSummary)
async def get_dataset_summary(dataset_id: str):
    try:
        df = get_dataset(dataset_id)

        # Profile basic features
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=['number', 'datetime']).columns.tolist()
        null_counts = df.isnull().sum().to_dict()
        data_types = {k: str(v) for k, v in df.dtypes.to_dict().items()}
        
        # Sample rows (head)
        sample = df.to_dict(orient="records")

        return DatasetSummary(
            row_count=df.shape[0],
            column_count=df.shape[1],
            data_types=data_types,
            null_counts=null_counts,
            numeric_columns=numeric_cols,
            categorical_columns=categorical_cols,
            sample_rows=sample
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))