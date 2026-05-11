import pandas as pd
import uuid
import io

from schemas.api_schemas import UploadResponse, DatasetSummary
from services.session_manager import save_dataset, get_dataset, reset_all_sessions
from services.data_service import clean_dataset
from database import get_db_connection

from fastapi.responses import StreamingResponse
from fastapi import Header
from typing import Optional

@router.get("/{dataset_id}/download")
async def download_dataset(
    dataset_id: str, 
    user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        df = get_dataset(dataset_id)
        
        # Insert history
        if not user_id:
            user_id = "default_user"
        
        dataset_name = f"dataset_{dataset_id[:8]}.csv"
        
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            "INSERT INTO DownloadHistory (user_id, dataset_id, dataset_name) VALUES (?, ?, ?)",
            (user_id, dataset_id, dataset_name)
        )
        conn.commit()
        conn.close()
        
        # Return CSV response
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)
        
        return StreamingResponse(
            iter([stream.getvalue()]), 
            media_type="text/csv", 
            headers={"Content-Disposition": f"attachment; filename={dataset_name}"}
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error downloading dataset: {e}")
        raise HTTPException(status_code=500, detail=str(e))
