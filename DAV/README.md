# Tourism Data Clustering and Revenue Analysis

This DAV mini-project analyzes the Kaggle tourism dataset using K-Means clustering to group countries with similar outbound tourism expenditure patterns. It also summarizes expenditure contribution by cluster so the segments can be compared easily.

## Project Objective

- Group countries based on tourism expenditure trends using K-Means clustering
- Identify country segments from historical expenditure features
- Analyze expenditure patterns across the clusters
- Provide a simple, reproducible Python workflow for the mini-project

## Files

- `tourism_kmeans.py` - main analysis script
- `kaggle_tourism_preview.py` - KaggleHub loader example for the public tourism dataset
- `requirements.txt` - Python dependencies

## 🚀 How to Run the Project 

To run this project on your computer, follow these simple steps:

### 1. Install Dependencies
Open your terminal (Command Prompt or PowerShell) in the project folder and run:
```bash
pip install -r requirements.txt
```

### 2. Run the Analysis
Execute the main script to process the data and generate the visualization:
```bash
python tourism_kmeans.py
```

### 3. View the Results
Once the script finishes, a new file will be created (or updated) in the `output/` folder.
- Open **`output/dashboard.html`** in any web browser (Chrome, Edge, or Firefox) to see the interactive charts, K-Means groups, and the Elbow Plot.

## 📊 Project Content

If you want to inspect the public Kaggle dataset `imtkaggleteam/tourism`, run:

```bash
python kaggle_tourism_preview.py
```

That script uses this file path:

```python
file_path = "20- average-expenditures-of-tourists-abroad.csv"
```

Note: this Kaggle dataset is a set of country-level tourism indicators, and the main project now uses it directly.

Generated files:

- `output/country_clustered.csv` - dataset with cluster labels
- `output/cluster_summary.csv` - aggregate summary by cluster
- `output/elbow_plot.png` - cluster selection chart
- `output/cluster_scatter.png` - PCA-based cluster visualization
- `output/dashboard.html` - interactive dashboard with all results (open in browser)

## Method

- Aggregate country-level tourism expenditure trends
- Clean and scale numeric tourism features
- Use the elbow method to inspect a suitable cluster count
- Train K-Means clustering
- Compare country groups by expenditure level, growth, and trend contribution

## Suggested Report Title

**Tourism Expenditure Clustering and Revenue Analysis using K-Means Clustering Algorithm**
