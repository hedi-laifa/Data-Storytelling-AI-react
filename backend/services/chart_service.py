import json
import pandas as pd
from typing import List
from schemas.api_schemas import ChartConfig
from loguru import logger
import plotly.express as px

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
    logger.info("Generating blazing fast heuristic charts...")
    parsed_charts = []
    
    num_cols = df.select_dtypes(include='number').columns.tolist()
    cat_cols = df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()

    # 1. Correlation Heatmap
    if len(num_cols) > 1:
        parsed_charts.append({
            "title": "Correlation Heatmap",
            "explanation": "Displays the linear relationships between numeric variables in your dataset. Darker/lighter colors indicate stronger correlations.",
            "variables_used": num_cols[:10], # limit to avoid giant heatmaps
            "config": {"type": "correlation_heatmap", "x": "", "y": ""}
        })
        
    # 2. Main Numeric Distribution
    if len(num_cols) > 0:
        parsed_charts.append({
            "title": f"Distribution of {num_cols[0]}",
            "explanation": f"Shows the spread, central tendency, and skewness of the {num_cols[0]} column.",
            "variables_used": [num_cols[0]],
            "config": {"type": "histogram", "x": num_cols[0], "y": ""}
        })

    # 3. Scatter Plot of first two numeric
    if len(num_cols) > 1:
        parsed_charts.append({
            "title": f"{num_cols[0]} vs {num_cols[1]}",
            "explanation": f"Scatter plot mapping {num_cols[0]} against {num_cols[1]} to uncover clustering or spread trends.",
            "variables_used": [num_cols[0], num_cols[1]],
            "config": {"type": "scatter", "x": num_cols[0], "y": num_cols[1]}
        })

    # 4. Top Categorical Distribution
    if len(cat_cols) > 0:
        parsed_charts.append({
            "title": f"Counts by {cat_cols[0]}",
            "explanation": f"Visualizes the frequency of each distinct category found in {cat_cols[0]}.",
            "variables_used": [cat_cols[0]],
            "config": {"type": "histogram", "x": cat_cols[0], "y": ""}
        })

    # Fallback if extremely empty
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
