from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import kagglehub
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from kagglehub import KaggleDatasetAdapter


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_PATH = OUTPUT_DIR / "country_clustered.csv"
SUMMARY_PATH = OUTPUT_DIR / "cluster_summary.csv"
ELBOW_PLOT_PATH = OUTPUT_DIR / "elbow_plot.png"
CLUSTER_PLOT_PATH = OUTPUT_DIR / "cluster_scatter.png"
KAGGLE_HANDLE = "imtkaggleteam/tourism"
KAGGLE_FILE_PATH = "20- average-expenditures-of-tourists-abroad.csv"


EXPENDITURE_COLUMN = "Outbound Tourism Expenditure (adjusted for US 2021 inflation)"
DASHBOARD_PATH = OUTPUT_DIR / "dashboard.html"


def load_data() -> pd.DataFrame:
    return kagglehub.dataset_load(
        KaggleDatasetAdapter.PANDAS,
        KAGGLE_HANDLE,
        KAGGLE_FILE_PATH,
    )


def build_country_features(df: pd.DataFrame) -> pd.DataFrame:
    working = df[["Entity", "Code", "Year", EXPENDITURE_COLUMN]].copy()
    working = working.dropna(subset=["Entity", "Year", EXPENDITURE_COLUMN])
    working["Year"] = pd.to_numeric(working["Year"], errors="coerce")
    working[EXPENDITURE_COLUMN] = pd.to_numeric(working[EXPENDITURE_COLUMN], errors="coerce")
    working = working.dropna(subset=["Year", EXPENDITURE_COLUMN])

    records = []
    for entity, group in working.groupby(["Entity", "Code"], dropna=False):
        group = group.sort_values("Year")
        years = group["Year"].to_numpy(dtype=float)
        expenditures = group[EXPENDITURE_COLUMN].to_numpy(dtype=float)
        start_expenditure = float(expenditures[0])
        end_expenditure = float(expenditures[-1])
        growth = end_expenditure - start_expenditure
        growth_rate = float((growth / start_expenditure) * 100) if start_expenditure else 0.0
        expenditure_slope = float(np.polyfit(years, expenditures, 1)[0]) if len(group) >= 2 else 0.0

        records.append(
            {
                "Entity": entity[0],
                "Code": entity[1],
                "years_covered": int(group["Year"].nunique()),
                "first_year": int(group["Year"].min()),
                "last_year": int(group["Year"].max()),
                "start_expenditure": start_expenditure,
                "end_expenditure": end_expenditure,
                "avg_expenditure": float(group[EXPENDITURE_COLUMN].mean()),
                "median_expenditure": float(group[EXPENDITURE_COLUMN].median()),
                "min_expenditure": float(group[EXPENDITURE_COLUMN].min()),
                "max_expenditure": float(group[EXPENDITURE_COLUMN].max()),
                "expenditure_std": float(group[EXPENDITURE_COLUMN].std(ddof=0)),
                "absolute_growth": float(growth),
                "growth_rate_percent": growth_rate,
                "expenditure_slope": expenditure_slope,
            }
        )

    country_features = pd.DataFrame(records)
    country_features = country_features.fillna(country_features.median(numeric_only=True))

    if len(country_features) < 2:
        raise ValueError("The Kaggle tourism dataset does not contain enough countries for clustering.")

    return country_features


def prepare_features(country_features: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    numeric_columns = [
        "years_covered",
        "first_year",
        "last_year",
        "start_expenditure",
        "end_expenditure",
        "avg_expenditure",
        "median_expenditure",
        "min_expenditure",
        "max_expenditure",
        "expenditure_std",
        "absolute_growth",
        "growth_rate_percent",
        "expenditure_slope",
    ]
    features = country_features[numeric_columns].copy()
    scaler = StandardScaler()
    scaled = pd.DataFrame(scaler.fit_transform(features), columns=numeric_columns)
    return scaled, numeric_columns


def find_best_k(features: pd.DataFrame, min_k: int = 2, max_k: int = 6) -> list[dict[str, float]]:
    scores = []
    for k in range(min_k, max_k + 1):
        model = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = model.fit_predict(features)
        scores.append(
            {
                "k": k,
                "inertia": float(model.inertia_),
                "silhouette": float(silhouette_score(features, labels)),
            }
        )
    return scores


def fit_clusters(features: pd.DataFrame, n_clusters: int = 3) -> tuple[KMeans, np.ndarray]:
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = model.fit_predict(features)
    return model, labels


def build_cluster_summary(clustered_countries: pd.DataFrame) -> pd.DataFrame:
    summary = clustered_countries.groupby("cluster").agg(
        countries=("Entity", "count"),
        avg_years_covered=("years_covered", "mean"),
        avg_start_expenditure=("start_expenditure", "mean"),
        avg_end_expenditure=("end_expenditure", "mean"),
        avg_expenditure=("avg_expenditure", "mean"),
        avg_growth=("absolute_growth", "mean"),
        avg_growth_rate_percent=("growth_rate_percent", "mean"),
        avg_trend_slope=("expenditure_slope", "mean"),
        total_latest_expenditure=("end_expenditure", "sum"),
    ).reset_index()

    summary["latest_expenditure_share_percent"] = (
        summary["total_latest_expenditure"] / summary["total_latest_expenditure"].sum() * 100
    ).round(2)
    return summary.sort_values("cluster").reset_index(drop=True)


def save_elbow_plot(scores: list[dict[str, float]]) -> None:
    plt.figure(figsize=(8, 5))
    k_values = [score["k"] for score in scores]
    inertias = [score["inertia"] for score in scores]
    silhouette_values = [score["silhouette"] for score in scores]

    plt.plot(k_values, inertias, marker="o", linewidth=2, label="Inertia")
    plt.plot(k_values, silhouette_values, marker="o", linewidth=2, label="Silhouette")
    plt.title("K-Means Cluster Selection")
    plt.xlabel("Number of clusters (k)")
    plt.ylabel("Score")
    plt.xticks(k_values)
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(ELBOW_PLOT_PATH, dpi=150)
    plt.close()


def save_cluster_plot(features: pd.DataFrame, labels: np.ndarray, cluster_centers: np.ndarray) -> None:
    pca = PCA(n_components=2, random_state=42)
    reduced_features = pca.fit_transform(features)
    centers_frame = pd.DataFrame(cluster_centers, columns=features.columns)
    reduced_centers = pca.transform(centers_frame)

    plot_frame = pd.DataFrame(
        {
            "component_1": reduced_features[:, 0],
            "component_2": reduced_features[:, 1],
            "cluster": labels,
        }
    )

    plt.figure(figsize=(8, 6))
    sns.scatterplot(
        data=plot_frame,
        x="component_1",
        y="component_2",
        hue="cluster",
        palette="deep",
        s=80,
    )
    plt.scatter(
        reduced_centers[:, 0],
        reduced_centers[:, 1],
        c="black",
        s=180,
        marker="X",
        label="Centroids",
    )
    plt.title("Tourist Segments Visualized with PCA")
    plt.xlabel("Principal Component 1")
    plt.ylabel("Principal Component 2")
    plt.legend()
    plt.tight_layout()
    plt.savefig(CLUSTER_PLOT_PATH, dpi=150)
    plt.close()


def generate_html_dashboard(
    cluster_summary: pd.DataFrame,
    clustered_countries: pd.DataFrame,
    scores: list[dict[str, float]],
) -> None:
    import base64

    def image_to_base64(image_path: str) -> str:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode()

    elbow_b64 = image_to_base64(str(ELBOW_PLOT_PATH))
    scatter_b64 = image_to_base64(str(CLUSTER_PLOT_PATH))

    cluster_details = []
    for _, row in clustered_countries.iterrows():
        cluster_details.append(
            {
                "entity": row["Entity"],
                "cluster": int(row["cluster"]),
                "avg_expenditure": f"${row['avg_expenditure']:,.0f}",
                "growth": f"{row['growth_rate_percent']:.1f}%",
            }
        )

    summary_html = cluster_summary.to_html(classes="table table-striped", index=False)
    summary_html = summary_html.replace('<th>', '<th style="background-color: #4CAF50; color: white;">')

    details_rows = ""
    for detail in cluster_details[:20]:
        color = "#e8f5e9" if detail["cluster"] == 0 else "#fff3e0"
        details_rows += f"""
        <tr style="background-color: {color};">
            <td>{detail['entity']}</td>
            <td>{detail['cluster']}</td>
            <td>{detail['avg_expenditure']}</td>
            <td>{detail['growth']}</td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tourism Expenditure Clustering Dashboard</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }}
            .container {{
                max-width: 1400px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .header h1 {{
                font-size: 2.5em;
                margin-bottom: 10px;
            }}
            .header p {{
                font-size: 1.1em;
                opacity: 0.9;
            }}
            .content {{
                padding: 40px;
            }}
            .section {{
                margin-bottom: 40px;
            }}
            .section h2 {{
                color: #667eea;
                margin-bottom: 20px;
                font-size: 1.8em;
                border-bottom: 3px solid #667eea;
                padding-bottom: 10px;
            }}
            .grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }}
            @media (max-width: 1024px) {{
                .grid {{
                    grid-template-columns: 1fr;
                }}
            }}
            .plot-container {{
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }}
            .plot-container img {{
                width: 100%;
                height: auto;
                border-radius: 8px;
            }}
            .table-container {{
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                overflow-x: auto;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 0;
            }}
            th {{
                background-color: #667eea;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: 600;
            }}
            td {{
                padding: 12px;
                border-bottom: 1px solid #ddd;
            }}
            tr:hover {{
                background-color: #f5f5f5 !important;
            }}
            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }}
            .stat-card {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }}
            .stat-card h3 {{
                font-size: 2em;
                margin-bottom: 10px;
            }}
            .stat-card p {{
                font-size: 0.95em;
                opacity: 0.9;
            }}
            .footer {{
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #666;
                border-top: 1px solid #ddd;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌍 Tourism Expenditure Clustering Dashboard</h1>
                <p>K-Means Analysis of Kaggle Tourism Dataset</p>
            </div>
            <div class="content">
                <div class="section">
                    <h2>📊 Key Statistics</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>{len(clustered_countries)}</h3>
                            <p>Countries Analyzed</p>
                        </div>
                        <div class="stat-card">
                            <h3>{len(cluster_summary)}</h3>
                            <p>Clusters Identified</p>
                        </div>
                        <div class="stat-card">
                            <h3>{max(scores, key=lambda x: x['silhouette'])['k']}</h3>
                            <p>Optimal Cluster Count</p>
                        </div>
                        <div class="stat-card">
                            <h3>{max(scores, key=lambda x: x['silhouette'])['silhouette']:.3f}</h3>
                            <p>Best Silhouette Score</p>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>📈 Cluster Analysis</h2>
                    <div class="grid">
                        <div class="plot-container">
                            <img src="data:image/png;base64,{elbow_b64}" alt="Elbow Method Plot">
                        </div>
                        <div class="plot-container">
                            <img src="data:image/png;base64,{scatter_b64}" alt="Cluster Visualization">
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>📋 Cluster Summary</h2>
                    <div class="table-container">
                        {summary_html}
                    </div>
                </div>

                <div class="section">
                    <h2>🌐 Sample Countries by Cluster (First 20)</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Country</th>
                                    <th>Cluster</th>
                                    <th>Avg Expenditure</th>
                                    <th>Growth Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details_rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Generated by Tourism Clustering Analysis | K-Means Clustering Algorithm</p>
            </div>
        </div>
    </body>
    </html>
    """

    with open(DASHBOARD_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)


def main() -> None:
    raw_data = load_data()
    country_features = build_country_features(raw_data)
    features, feature_names = prepare_features(country_features)

    scores = find_best_k(features, min_k=2, max_k=min(6, len(country_features) - 1))
    best_k = max(scores, key=lambda item: item["silhouette"])["k"]
    best_k = int(best_k)

    model, labels = fit_clusters(features, n_clusters=best_k)

    clustered_countries = country_features.copy()
    clustered_countries["cluster"] = labels

    cluster_summary = build_cluster_summary(clustered_countries)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    clustered_countries.to_csv(OUTPUT_PATH, index=False)
    cluster_summary.to_csv(SUMMARY_PATH, index=False)

    save_elbow_plot(scores)
    save_cluster_plot(features, labels, model.cluster_centers_)
    generate_html_dashboard(cluster_summary, clustered_countries, scores)

    print("Tourism Expenditure Clustering and Revenue Analysis")
    print("=" * 50)
    print("Elbow and silhouette scores:")
    for score in scores:
        print(
            f"k={score['k']} | inertia={score['inertia']:.2f} | silhouette={score['silhouette']:.3f}"
        )

    print(f"\nSelected clusters: {best_k}")
    print("\nCluster Summary:")
    print(cluster_summary.to_string(index=False))

    print("\nCluster centroids in scaled feature space:")
    centroids = pd.DataFrame(model.cluster_centers_, columns=feature_names)
    print(centroids.round(3).to_string(index=False))

    print(f"\nClustered dataset saved to: {OUTPUT_PATH}")
    print(f"Cluster summary saved to: {SUMMARY_PATH}")
    print(f"Elbow plot saved to: {ELBOW_PLOT_PATH}")
    print(f"Cluster plot saved to: {CLUSTER_PLOT_PATH}")
    print(f"Dashboard saved to: {DASHBOARD_PATH}")
    print(f"\n✨ Open {DASHBOARD_PATH} in your browser to view the interactive dashboard!")


if __name__ == "__main__":
    main()
