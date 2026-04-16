# 🤖 Data Storytelling AI

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5+-green.svg)](https://openai.com)

> **Transform raw data into professional, AI-powered insights in seconds — no coding required!**

An intelligent, autonomous system that analyzes your data and generates comprehensive reports with charts, statistics, and natural language narratives. Built with a 5-agent architecture and powered by OpenAI GPT.

---

## ✨ Features

🚀 **Fully Autonomous** - Upload data → Get insights (zero manual intervention)  
🤖 **AI-Powered Narratives** - Natural language reports using GPT-3.5/GPT-4  
📊 **Comprehensive Analysis** - 20+ statistical tests, correlations, trends, outliers  
📈 **Beautiful Visualizations** - 5+ chart types (static PNG + interactive HTML)  
🌐 **Web Interface** - Browser-based UI for non-technical users  
🐍 **Python API** - Simple programmatic access for developers  
📄 **Multi-Format Export** - Markdown, PDF, PNG, HTML reports  
✅ **Production Ready** - Full test coverage, error handling, logging  

---

## 🎯 Quick Start (30 seconds!)

### Option 1: Web Interface (No Coding!)

```bash
# 1. Install
pip install -r requirements.txt

# 2. Launch
streamlit run app.py

# 3. Open browser to http://localhost:8501
```

**That's it!** Now you can:
- 📤 Drag & drop your CSV/Excel file
- 👁️ Preview and configure analysis
- 🤖 Click "Run Analysis" button
- 📊 View charts and insights
- 📥 Download your report

### Option 2: Python API (One-Liner!)

```python
from pipeline import AnalysisPipeline

# Execute complete analysis in one line
report = AnalysisPipeline().execute('your_data.csv')
```

---

## 🏗️ Architecture

The system uses **5 specialized AI agents** working together:

```
                    📋 OrchestratorAgent
                   (Pipeline Coordinator)
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
🔍 Data Loading    🧠 Insights       📊 Charts        📝 Reports
DataUnderstanding  InsightAgent   Visualization   NarrativeAgent
   Agent                               Agent
```

### 1. 🔍 DataUnderstandingAgent
**Data Loading & Cleaning**
- Load CSV/Excel files
- Auto-detect data types
- Handle missing values (multiple strategies)
- Remove duplicates
- Data quality scoring

### 2. 🧠 InsightAgent
**Statistical Analysis**
- Summary statistics (mean, median, std, quartiles)
- Correlation analysis (Pearson, Spearman, Kendall)
- Trend detection (linear regression, time series)
- Outlier detection (IQR, Z-score, Isolation Forest)
- Pattern discovery and ranking

### 3. 📊 VisualizationAgent
**Automatic Chart Generation**
- Correlation heatmaps
- Distribution histograms
- Box plots for outliers
- Bar charts for categories
- Time series plots
- Both static (PNG) and interactive (HTML)

### 4. 📝 NarrativeAgent
**AI Report Writing**
- OpenAI GPT integration
- Natural language generation
- Structured 6-section reports
- Markdown + PDF export
- Works with/without API key

### 5. 📋 OrchestratorAgent
**Pipeline Coordination**
- Manages all agents
- Controls execution flow
- Validates outputs
- Error handling
- Comprehensive logging

---

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Step 1: Clone Repository
```bash
git clone https://github.com/hedi-laifa/Data-Storytelling-AI.git
cd Data-Storytelling-AI
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure OpenAI (Optional)
For AI-generated narratives, add your API key:

```bash
# Copy template
cp .env.example .env

# Edit .env file
OPENAI_API_KEY=sk-your-api-key-here
```

> **Note:** System works without API key using template-based reports

### Step 4: Launch!
```bash
# Web interface
streamlit run app.py

# OR Python script
python example_pipeline.py
```

---

## 🚀 Usage Examples

### Web Interface
Perfect for non-technical users:

```bash
streamlit run app.py
```

Features:
- 📤 Drag & drop file upload
- 👁️ Interactive data preview  
- ⚙️ Point-and-click configuration
- 📊 Real-time visualizations
- 📄 One-click downloads
- 🎮 Demo mode with samples

[Full Web UI Guide →](docs/STREAMLIT_GUIDE.md)

---

### Python API (Simplified)

```python
from pipeline import AnalysisPipeline

# Basic usage
pipeline = AnalysisPipeline(output_dir='reports')
report = pipeline.execute('data.csv')

# Quick mode (skip visualizations/narratives)
from pipeline import create_pipeline
pipeline = create_pipeline('output', quick_mode=True)
report = pipeline.execute('data.csv')

# Batch processing
results = pipeline.execute_batch(['file1.csv', 'file2.csv', 'file3.csv'])
print(f"Processed {results['successful']}/{results['total']} files")

# Builder pattern
from pipeline import PipelineBuilder
pipeline = (PipelineBuilder()
    .with_output_dir('reports')
    .with_visualizations()
    .without_narratives()
    .build())
```

[Full Pipeline Examples →](example_pipeline.py)

---

### Agent-Based Control (Advanced)

```python
from agents import OrchestratorAgent

# Full control
orchestrator = OrchestratorAgent(
    output_dir='reports',
    enable_visualizations=True,
    enable_narratives=True,
    openai_api_key='sk-...'  # Optional
)

# Run complete pipeline
result = orchestrator.run_pipeline('data.csv')

# Access results
print(f"Insights: {len(result['insights']['ranked_insights'])}")
print(f"Charts: {len(result['visualizations'])}")
print(f"Report: {result['reports']['markdown']}")
```

---

### Individual Agents

```python
from agents import (
    DataUnderstandingAgent,
    InsightAgent,
    VisualizationAgent,
    NarrativeAgent
)

# Stage 1: Data cleaning
data_agent = DataUnderstandingAgent(handle_missing='auto')
df, metadata, stats = data_agent.execute('data.csv')

# Stage 2: Extract insights
insight_agent = InsightAgent()
insights = insight_agent.execute(df)

# Stage 3: Generate charts
viz_agent = VisualizationAgent(output_dir='charts')
charts = viz_agent.execute({
    'dataframe': df,
    'insights': insights,
    'metadata': metadata
})

# Stage 4: Write report
narrative_agent = NarrativeAgent(output_dir='reports')
reports = narrative_agent.execute({
    'dataframe': df,
    'insights': insights,
    'metadata': metadata,
    'visualizations': charts,
    'statistics': stats
})

print(f"✅ Complete! Report: {reports['markdown']}")
```

---

## 📁 Project Structure

```
Data-Storytelling-AI/
├── agents/                      # 5 AI agents
│   ├── __init__.py
│   ├── data_understanding.py    # Data loading & cleaning
│   ├── insight_agent.py         # Statistical analysis
│   ├── visualization_agent.py   # Chart generation
│   ├── narrative_agent.py       # Report writing
│   └── orchestrator_agent.py    # Pipeline coordinator
├── pages/                       # Streamlit pages
│   ├── 1_📊_Demo_Mode.py        # Sample datasets
│   └── 2_📚_Documentation.py    # User guide
├── docs/                        # Documentation
│   ├── STREAMLIT_GUIDE.md       # Web UI manual
│   ├── PIPELINE.md              # Pipeline guide
│   └── [agent documentation]
├── tests/                       # Test suite
│   └── test_system.py           # 81 unit tests
├── data/                        # Sample datasets
├── app.py                       # Streamlit web app
├── pipeline.py                  # AnalysisPipeline
├── main.py                      # CLI interface
├── config.py                    # Configuration
├── requirements.txt             # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 📊 Example Output

### Generated Report Structure

```markdown
# 📊 Data Analysis Report: Sales Dataset
Generated on 2024-01-15 14:30:00

## 1. 📋 Introduction
Overview of the dataset and analysis objectives...

## 2. 📈 Data Overview
- **Rows:** 10,000
- **Columns:** 15
- **Quality Score:** 0.94/1.00
- **Completeness:** 98.5%

## 3. 💡 Key Insights
1. Strong positive correlation (0.87) between X and Y
2. Seasonal trend detected in sales data
3. 47 outliers identified in revenue column
...

## 4. 📊 Visualization Analysis
Interpretation of generated charts...

## 5. ✅ Conclusion
Summary of findings and limitations...

## 6. 🎯 Recommendations
Actionable next steps based on insights...
```

### Sample Visualizations

The system automatically generates:
1. **Correlation Heatmap** - Variable relationships
2. **Distribution Histograms** - Data spread analysis
3. **Box Plots** - Outlier visualization
4. **Bar Charts** - Category comparisons
5. **Time Series Plots** - Trend analysis

All charts available as:
- High-res PNG files (300 DPI)
- Interactive HTML (Plotly)

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Using pytest
pytest tests/ -v

# Using unittest
python -m unittest tests.test_system

# Run specific test
python -m unittest tests.test_system.TestDataUnderstanding
```

**Coverage:** 81 tests across all agents + pipeline

---

## 📚 Documentation

- **[Web Interface Guide](docs/STREAMLIT_GUIDE.md)** - Complete UI tutorial
- **[Pipeline API](docs/PIPELINE.md)** - AnalysisPipeline reference
- **[Agent Documentation](docs/)** - Individual agent guides
- **[Examples](example_pipeline.py)** - Code samples

---

## 🐛 Troubleshooting

### Common Issues

**"ModuleNotFoundError: No module named 'openai'"**
```bash
pip install openai>=1.0.0
```

**"API key not found"**
- Create `.env` file from `.env.example`
- Add your OpenAI API key
- Or run without API key (uses templates)

**PDF generation fails**
```bash
pip install fpdf2>=2.7.0 reportlab>=4.0.0
```

**Streamlit not found**
```bash
pip install streamlit>=1.28.0
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🗺️ Roadmap

### ✅ Completed
- [x] 5-agent architecture
- [x] Web interface (Streamlit)
- [x] Python API (AnalysisPipeline)
- [x] Comprehensive testing (81 tests)
- [x] Full documentation
- [x] Multi-format export (MD/PDF/PNG/HTML)

### 🔮 Planned
- [ ] Database connectors (SQL, MongoDB, PostgreSQL)
- [ ] Real-time data streaming
- [ ] Custom report templates
- [ ] REST API server
- [ ] Multi-language support (i18n)
- [ ] Cloud deployment guides (AWS, Azure, GCP)
- [ ] Scheduled analysis (cron jobs)
- [ ] Email report delivery

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/hedi-laifa/Data-Storytelling-AI/issues)
- **Documentation:** [Full guides](docs/)
- **Examples:** [Sample code](example_pipeline.py)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 🙏 Acknowledgments

Built with:
- **[OpenAI GPT](https://openai.com)** - AI narrative generation
- **[Streamlit](https://streamlit.io)** - Web interface framework
- **[Pandas](https://pandas.pydata.org)** - Data manipulation
- **[Plotly](https://plotly.com)** - Interactive visualizations
- **[scikit-learn](https://scikit-learn.org)** - Machine learning tools

---

<div align="center">
  
**Made with ❤️ for automated data storytelling**

[⬆ Back to Top](#-data-storytelling-ai)

</div>
