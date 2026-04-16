import pandas as pd
from typing import Dict

# Dictionary mapping dataset_id -> DataFrame
# In a real production app, use Redis or a distributed cache
_sessions: Dict[str, pd.DataFrame] = {}

def save_dataset(dataset_id: str, df: pd.DataFrame) -> None:
    _sessions[dataset_id] = df

def get_dataset(dataset_id: str) -> pd.DataFrame:
    if dataset_id not in _sessions:
        raise ValueError("Dataset session not found or expired.")
    return _sessions[dataset_id]

def clear_dataset(dataset_id: str) -> None:
    if dataset_id in _sessions:
        del _sessions[dataset_id]

def reset_all_sessions() -> None:
    _sessions.clear()