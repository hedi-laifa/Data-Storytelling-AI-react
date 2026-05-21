import json
import pandas as pd
from typing import List
from schemas.api_schemas import ChartConfig
from loguru import logger
import plotly.express as px
from langchain_openai import ChatOpenAI
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from utils.config import settings

def generate_plotly_fig(df: pd.DataFrame, conf: dict):
    """Generate a Plotly figure from abstract config dictionary."""
    c_type = conf.get("type", "")
    x = conf.get("x")
    y = conf.get("y")
    
    if not c_type:
        return None
        
    try:
        plot_df = df.head(1000)
        
        if c_type == "bar" and x in plot_df.columns:
            return px.bar(plot_df, x=x, y=y if y in plot_df.columns else None)
        elif c_type == "line" and x in plot_df.columns:
            return px.line(plot_df, x=x, y=y if y in plot_df.columns else None)
        elif c_type == "scatter" and x in plot_df.columns:
            return px.scatter(plot_df, x=x, y=y if y in plot_df.columns else None)
        elif c_type == "histogram" and x in plot_df.columns:
            return px.histogram(plot_df, x=x)
        elif c_type == "correlation_heatmap":
            num_df = plot_df.select_dtypes(include='number')
            if not num_df.empty:
                return px.imshow(num_df.corr(), text_auto=True)
    except Exception as e:
        logger.error(f"Error drawing {c_type} with x={x}, y={y}: {e}")
    return None

def generate_charts(df: pd.DataFrame) -> List[ChartConfig]:
    logger.info("Generating charts using Data Agent...")
    parsed_charts = []
    
    num_cols = df.select_dtypes(include='number').columns.tolist()
    cat_cols = df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()

    try:
        llm = ChatOpenAI(
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            api_key=settings.XAI_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )

        df_columns = ", ".join(df.columns.astype(str).tolist())
        df_dtypes = df.dtypes.to_string()
        df_head = df.head(3).to_string()

        prompt = f"""As a Data Visualization expert, look at the dataframe info and propose 4 interesting charts to visualize it.

Dataset Columns: {df_columns}
Data Types:
{df_dtypes}
First 3 Rows:
{df_head}

Your answer MUST be strictly a valid JSON array of objects mapping exactly to this structure (no markdown tags, just the JSON):
[
  {{
    "title": "Chart Title",
    "explanation": "Why this chart is interesting",
    "variables_used": ["col1", "col2"],
    "config": {{
      "type": "histogram|scatter|bar|line|correlation_heatmap",
      "x": "col1",
      "y": "col2 (optional)"
    }}
  }}
]
Use only existing columns from the dataframe.
"""
        result = llm.invoke(prompt)
        content = result.content
        
        # Clean up markdown if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        parsed_charts = json.loads(content)
        if not isinstance(parsed_charts, list):
            parsed_charts = []
            
    except Exception as e:
        logger.error(f"Failed to generate charts via agent, falling back to heuristics. Error: {e}")
        # Fallback heuristic logic
        if len(num_cols) > 1:
            parsed_charts.append({
                "title": "Correlation Heatmap",
                "explanation": "Displays the linear relationships between numeric variables in your dataset. Darker/lighter colors indicate stronger correlations.",
                "variables_used": num_cols[:10],
                "config": {"type": "correlation_heatmap", "x": "", "y": ""}
            })
            
        if len(num_cols) > 0:
            parsed_charts.append({
                "title": f"Distribution of {num_cols[0]}",
                "explanation": f"Shows the spread, central tendency, and skewness of the {num_cols[0]} column.",
                "variables_used": [num_cols[0]],
                "config": {"type": "histogram", "x": num_cols[0], "y": ""}
            })

        if len(num_cols) > 1:
            parsed_charts.append({
                "title": f"{num_cols[0]} vs {num_cols[1]}",
                "explanation": f"Scatter plot mapping {num_cols[0]} against {num_cols[1]} to uncover clustering or spread trends.",
                "variables_used": [num_cols[0], num_cols[1]],
                "config": {"type": "scatter", "x": num_cols[0], "y": num_cols[1]}
            })

        if len(cat_cols) > 0:
            parsed_charts.append({
                "title": f"Counts by {cat_cols[0]}",
                "explanation": f"Visualizes the frequency of each distinct category found in {cat_cols[0]}.",
                "variables_used": [cat_cols[0]],
                "config": {"type": "histogram", "x": cat_cols[0], "y": ""}
            })

        if not parsed_charts:
            cols = list(df.columns)
            if cols:
                parsed_charts.append({
                    "title": "Basic Distribution",
                    "explanation": "Count of records.",
                    "variables_used": [cols[0]],
                    "config": {"type": "histogram", "x": cols[0], "y": ""}
                })

    charts = []
    for chart in parsed_charts:
        try:
            fig = generate_plotly_fig(df, chart.get("config", {}))
            if fig:
                chart["plotly_json"] = json.loads(fig.to_json())
                charts.append(ChartConfig(**chart))
            else:
                logger.warning(f"Skipped chart {chart.get('title')} due to failed Plotly rendering.")
        except Exception as inner_e:
            logger.error(f"Failed parsing individual chart config: {inner_e}")
            
    return charts
