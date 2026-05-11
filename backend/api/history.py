from fastapi import APIRouter, HTTPException, Query, Header, Depends
from fastapi.responses import StreamingResponse
import sqlite3
import io
import json
from typing import List, Optional
from schemas.api_schemas import DownloadHistoryResponse
from database import get_db_connection
from loguru import logger
from utils.security import get_current_user

router = APIRouter()

@router.get("/{history_id}/download-report")
async def download_report(
    history_id: int,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db_connection()
    row = conn.execute("SELECT report_json, dataset_name FROM DownloadHistory WHERE id = ? AND user_id = ?",
                       (history_id, current_user["id"])).fetchone()
    conn.close()
    
    if not row or not row["report_json"]:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report_data = json.loads(row["report_json"])
    # Format as a simple text/markdown report
    content = f"# Storytelling Report for {row['dataset_name']}\n\n"
    content += "## Executive Summary\n" + report_data.get("executive_summary", "") + "\n\n"
    content += "## Key Insights\n" + "\n".join([f"- {x}" for x in report_data.get("key_insights", [])]) + "\n\n"
    content += "## Trends\n" + "\n".join([f"- {x}" for x in report_data.get("trends", [])]) + "\n\n"
    content += "## Anomalies\n" + "\n".join([f"- {x}" for x in report_data.get("anomalies", [])]) + "\n\n"
    content += "## Business Recommendations\n" + "\n".join([f"- {x}" for x in report_data.get("business_recommendations", [])]) + "\n"
    
    stream = io.StringIO()
    stream.write(content)
    stream.seek(0)
    
    return StreamingResponse(
        iter([stream.getvalue()]), 
        media_type="text/markdown", 
        headers={"Content-Disposition": f"attachment; filename=report_{row['dataset_name']}.md"}
    )

@router.get("/", response_model=List[DownloadHistoryResponse])
async def get_history(
    current_user: dict = Depends(get_current_user),
    dataset_name: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0
):
    user_id = current_user["id"]
        
    conn = get_db_connection()
    c = conn.cursor()
    
    query = "SELECT * FROM DownloadHistory WHERE user_id = ?"
    params = [user_id]
    
    if dataset_name:
        query += " AND dataset_name LIKE ?"
        params.append(f"%{dataset_name}%")
        
    query += " ORDER BY downloaded_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    
    return [
        DownloadHistoryResponse(
            id=row["id"],
            user_id=row["user_id"],
            dataset_id=row["dataset_id"] or "",
            dataset_name=row["dataset_name"] or "Unknown Dataset",
            downloaded_at=row["downloaded_at"],
            has_report=bool(row["report_json"]),
            report_json=row["report_json"]
        ) for row in rows
    ]
