"""
Tourism Data Clustering & Revenue Analysis
Subject Project for Data Analysis and Visualization (DAV).
"""

import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

# --- Configuration ---
DATA_FILE = "world_tourism_economy_data.csv"
OUTPUT_DIR = Path("output")
DASHBOARD_PATH = OUTPUT_DIR / "dashboard.html"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def load_and_clean_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_FILE)
    df.columns = [col.lower() for col in df.columns]
    aggregates = ["WLD", "HIC", "MIC", "LIC", "LMC", "UMC", "EUU", "EAS", "ECS", "LCN", "MEA", "NAC", "SAS", "SSA", "AFE", "AFW"]
    df = df[~df["country_code"].isin(aggregates)]
    df = df[df["country_code"].str.len() == 3]
    df[df.select_dtypes(include=[np.number]).columns] = df.select_dtypes(include=[np.number]).fillna(0)
    return df

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    records = []
    for (country, code), group in df.groupby(["country", "country_code"]):
        recent = group.sort_values("year").tail(10)
        avg_receipts = recent["tourism_receipts"].mean()
        avg_arrivals = recent["tourism_arrivals"].mean()
        avg_gdp = recent["gdp"].mean()
        if avg_receipts < 1e5 or avg_arrivals < 100: continue
        records.append({
            "name": country,
            "code": code,
            "receipts": avg_receipts,
            "arrivals": avg_arrivals,
            "gdp": avg_gdp,
            "efficiency": avg_receipts / avg_arrivals,
            "dependency": (avg_receipts / avg_gdp * 100) if avg_gdp > 0 else 0
        })
    return pd.DataFrame(records)

def generate_dashboard(df: pd.DataFrame, summary: pd.DataFrame, elbow: list, stats: dict):
    payload = {
        "countries": df.to_dict(orient="records"),
        "summary": summary.to_dict(orient="records"),
        "elbow": elbow,
        "stats": stats
    }
    data_json = json.dumps(payload)
    
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>DAV Project: Tourism Clustering</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <style>
            :root {
                --bg: #0f172a;
                --side: #1e293b;
                --card: #1e293b;
                --accent: #38bdf8;
                --border: rgba(255, 255, 255, 0.1);
                --text: #ffffff;
                --text-dim: #94a3b8;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Poppins', sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
            
            .sidebar { width: 250px; background: var(--side); border-right: 1px solid var(--border); padding: 40px 20px; display: flex; flex-direction: column; }
            .logo { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 40px; line-height: 1.4; }
            .nav-btn { padding: 12px 15px; color: var(--text-dim); text-decoration: none; font-size: 0.85rem; border-radius: 10px; margin-bottom: 5px; cursor: pointer; }
            .nav-btn:hover, .nav-btn.active { background: rgba(255,255,255,0.05); color: var(--accent); }

            .main-content { flex: 1; padding: 40px; overflow-y: auto; scroll-behavior: smooth; }
            
            .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
            .kpi-card { background: var(--card); border: 1px solid var(--border); padding: 20px; border-radius: 15px; }
            .kpi-title { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px; }
            .kpi-val { font-size: 1.3rem; font-weight: 600; }

            .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
            .card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 25px; }
            .card-header { font-size: 0.95rem; font-weight: 600; margin-bottom: 20px; color: #fff; border-left: 3px solid var(--accent); padding-left: 12px; }

            .controls { display: flex; gap: 10px; margin-bottom: 15px; }
            input, select { 
                background: #0f172a; 
                border: 1px solid var(--border); 
                color: #fff; 
                padding: 10px 15px; 
                border-radius: 10px; 
                font-family: inherit; 
                font-size: 0.8rem; 
                outline: none;
                height: 40px;
            }
            select option { background: #1e293b; color: #fff; }
            input { flex: 1; }

            .chart-area { width: 100%; height: 400px; position: relative; }
            
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid var(--border); }
            td { padding: 12px; font-size: 0.8rem; border-bottom: 1px solid var(--border); }
            
            .page-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding-bottom: 40px; }
            .btn { padding: 5px 15px; background: #0f172a; border: 1px solid var(--border); color: #fff; border-radius: 8px; cursor: pointer; font-size: 0.75rem; }
            .btn:disabled { opacity: 0.3; }

            .tooltip { position: absolute; padding: 10px; background: rgba(0,0,0,0.9); border: 1px solid var(--accent); border-radius: 8px; font-size: 0.75rem; pointer-events: none; z-index: 1000; }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div class="logo">Tourism Data Clustering and Revenue Analysis </div>
            <a href="#summary" class="nav-btn active">Analysis Summary</a>
            <a href="#visuals" class="nav-btn">K-Means Visualization</a>
            <a href="#registry" class="nav-btn">Data Registry</a>
        </div>

        <main class="main-content">
            <div id="summary" class="kpi-row">
                <div class="kpi-card"><div class="kpi-title">Data Points (Count)</div><div class="kpi-val">%%COUNT%%</div></div>
                <div class="kpi-card"><div class="kpi-title">Total Tourism Receipts</div><div class="kpi-val">$%%RECEIPTS%%T</div></div>
                <div class="kpi-card"><div class="kpi-title">Average Yield</div><div class="kpi-val">$%%EFFICIENCY%%</div></div>
                <div class="kpi-card"><div class="kpi-title">Silhouette Score</div><div class="kpi-val">%%SILHOUETTE%%</div></div>
            </div>

            <div id="visuals" class="grid-2">
                <div class="card">
                    <div class="card-header">K-Means Clustering: Arrivals vs Revenue</div>
                    <div class="controls">
                        <input type="text" id="search" placeholder="Search by Country Name...">
                        <select id="pick"><option value="">Select Entity...</option></select>
                    </div>
                    <div id="main-scatter" class="chart-area"></div>
                </div>
                <div class="card">
                    <div class="card-header">Cluster Membership Share</div>
                    <div id="donut" class="chart-area" style="height: 250px;"></div>
                    <div id="group-labels" style="margin-top: 20px;"></div>
                </div>
            </div>

            <div class="grid-2" style="grid-template-columns: 1fr 1fr;">
                <div class="card">
                    <div class="card-header">K-Selection: Elbow Method</div>
                    <div id="elbow" class="chart-area" style="height: 350px;"></div>
                </div>
                <div class="card">
                    <div class="card-header">Cluster Centroid Statistics</div>
                    <table>
                        <thead><tr><th>Cluster Group</th><th>Avg Receipts</th><th>Avg Yield</th></tr></thead>
                        <tbody id="avg-table"></tbody>
                    </table>
                </div>
            </div>

            <div id="registry" class="card">
                <div class="card-header">Global Tourism Data Registry</div>
                <div style="overflow-x: auto; border: 1px solid var(--border); border-radius: 10px;">
                    <table>
                        <thead><tr><th>Country</th><th>Cluster</th><th>Receipts</th><th>Arrivals</th><th>Yield</th></tr></thead>
                        <tbody id="main-table"></tbody>
                    </table>
                </div>
                <div class="page-row">
                    <button class="btn" id="p">Previous Page</button>
                    <button class="btn" id="n">Next Page</button>
                </div>
            </div>
        </main>

        <div id="tooltip" class="tooltip" style="opacity:0"></div>

        <script>
            const data = %%DATA_JSON%%;
            const colors = ["#38bdf8", "#818cf8", "#fb7185", "#34d399"];
            const labels = ["Cluster 0: Global Leaders", "Cluster 1: Volume Markets", "Cluster 2: Premium Hubs", "Cluster 3: Emerging Markets"];
            const tt = d3.select("#tooltip");
            function fmt(v) { return d3.format(".2s")(v).replace('G', 'B'); }

            let dots;

            function drawScatter() {
                const con = d3.select("#main-scatter"); con.html("");
                const m = {top: 10, right: 10, bottom: 40, left: 60}, w = con.node().clientWidth - m.left - m.right, h = 400 - m.top - m.bottom;
                const svg = con.append("svg").attr("width", w+m.left+m.right).attr("height", h+m.top+m.bottom).append("g").attr("transform", `translate(${m.left},${m.top})`);
                const x = d3.scaleLog().domain([d3.min(data.countries, d => d.arrivals)*0.8, d3.max(data.countries, d => d.arrivals)*1.2]).range([0, w]);
                const y = d3.scaleLog().domain([d3.min(data.countries, d => d.receipts)*0.8, d3.max(data.countries, d => d.receipts)*1.2]).range([h, 0]);
                const r = d3.scaleSqrt().domain(d3.extent(data.countries, d => d.gdp)).range([5, 25]);
                svg.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).ticks(5, "~s")).attr("color", "#4b5563");
                svg.append("g").call(d3.axisLeft(y).ticks(5, "$~s")).attr("color", "#4b5563");
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", h + 34)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#94a3b8")
                    .attr("font-size", 12)
                    .text("Tourist Arrivals");
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -h / 2)
                    .attr("y", -42)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#94a3b8")
                    .attr("font-size", 12)
                    .text("Tourism Receipts");
                dots = svg.selectAll("circle").data(data.countries).enter().append("circle")
                    .attr("cx", d => x(d.arrivals)).attr("cy", d => y(d.receipts)).attr("r", d => r(d.gdp))
                    .attr("fill", d => colors[d.cluster]).attr("opacity", 0.7).attr("stroke", "#fff")
                    .on("mouseover", (e, d) => {
                        tt.style("opacity", 1).html(`<b>${d.name}</b><br>Cluster: ${d.cluster}`).style("left",(e.pageX+10)+"px").style("top",(e.pageY-10)+"px");
                    }).on("mouseout", () => tt.style("opacity", 0));
            }

            function drawDonut() {
                const con = d3.select("#donut"); con.html("");
                const w = con.node().clientWidth, h = 250, rad = 90;
                const svg = con.append("svg").attr("width", w).attr("height", h).append("g").attr("transform", `translate(${w/2},${h/2})`);
                const pie = d3.pie().value(d => d.countries);
                const arc = d3.arc().innerRadius(60).outerRadius(rad);
                svg.selectAll("path").data(pie(data.summary)).enter().append("path").attr("d", arc).attr("fill", (d,i) => colors[i]).attr("stroke", "#1e293b").attr("stroke-width", 2);
            }

            function drawElbow() {
                const con = d3.select("#elbow"); con.html("");
                const m = {top: 10, right: 10, bottom: 40, left: 60}, w = con.node().clientWidth - m.left - m.right, h = 350 - m.top - m.bottom;
                const svg = con.append("svg").attr("width", w+m.left+m.right).attr("height", h+m.top+m.bottom).append("g").attr("transform", `translate(${m.left},${m.top})`);
                const x = d3.scaleLinear().domain([1, data.elbow.length]).range([0, w]);
                const y = d3.scaleLinear().domain([0, d3.max(data.elbow, d => d.inertia)]).range([h, 0]);
                svg.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
                svg.append("g").call(d3.axisLeft(y).ticks(5, ".1e"));
                svg.append("text")
                    .attr("x", w / 2)
                    .attr("y", h + 34)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#94a3b8")
                    .attr("font-size", 12)
                    .text("Number of Clusters (K)");
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -h / 2)
                    .attr("y", -42)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#94a3b8")
                    .attr("font-size", 12)
                    .text("Inertia");
                svg.append("path").datum(data.elbow).attr("fill","none").attr("stroke", "#38bdf8").attr("stroke-width",2).attr("d", d3.line().x(d => x(d.k)).y(d => y(d.inertia)));
                svg.selectAll("circle").data(data.elbow).enter().append("circle").attr("cx", d => x(d.k)).attr("cy", d => y(d.inertia)).attr("r", 5).attr("fill", "#38bdf8")
                    .on("mouseover", (e, d) => {
                        tt.style("opacity", 1)
                            .html(`<b>K = ${d.k}</b><br>Inertia: ${d3.format(".3s")(d.inertia).replace('G', 'B')}`)
                            .style("left", (e.pageX + 10) + "px")
                            .style("top", (e.pageY - 10) + "px");
                    })
                    .on("mouseout", () => tt.style("opacity", 0));
            }

            // Controls
            const sel = d3.select("#pick");
            data.countries.sort((a,b) => a.name.localeCompare(b.name)).forEach(c => sel.append("option").attr("value", c.name).text(c.name));
            sel.on("change", function() {
                const val = this.value;
                dots.transition().duration(500).attr("opacity", d => (val==="" || d.name===val) ? 0.8 : 0.1).attr("r", d => d.name===val ? 30 : 10);
            });
            d3.select("#search").on("input", function() {
                const val = this.value.toLowerCase();
                dots.attr("opacity", d => d.name.toLowerCase().includes(val) ? 0.8 : 0.1);
            });

            // Table
            let page = 0;
            function drawTable() {
                const s = page * 10, e = s + 10, pData = data.countries.slice(s, e);
                const b = d3.select("#main-table"); b.html("");
                pData.forEach(c => {
                    const tr = b.append("tr");
                    tr.append("td").text(c.name);
                    tr.append("td").style("color", colors[c.cluster]).text("Cluster " + c.cluster);
                    tr.append("td").text("$"+fmt(c.receipts));
                    tr.append("td").text(fmt(c.arrivals));
                    tr.append("td").text("$"+Math.round(c.efficiency));
                });
            }
            d3.select("#n").on("click", () => { page++; drawTable(); });
            d3.select("#p").on("click", () => { page = Math.max(0, page-1); drawTable(); });

            data.summary.forEach((s, i) => {
                const tr = d3.select("#avg-table").append("tr");
                tr.append("td").style("color", colors[i]).style("font-weight", "600").text(labels[i]);
                tr.append("td").text("$"+fmt(s.receipts));
                tr.append("td").text("$"+Math.round(s.avg_spending_efficiency));
                
                const d = d3.select("#group-labels").append("div").style("display","flex").style("justify-content","space-between").style("padding","6px 0").style("border-bottom","1px solid rgba(255,255,255,0.05)");
                d.append("div").html("<span style='color:"+colors[i]+"'>●</span> " + labels[i]);
                d.append("div").style("color", "#9ca3af").text(s.countries + " items");
            });

            drawScatter(); drawDonut(); drawElbow(); drawTable();
        </script>
    </body>
    </html>
    """
    
    # Placeholders
    html = html_template.replace("%%DATA_JSON%%", data_json)
    html = html.replace("%%COUNT%%", str(stats['count']))
    html = html.replace("%%RECEIPTS%%", f"{stats['total_receipts']/1e12:.2f}")
    html = html.replace("%%EFFICIENCY%%", f"{stats['avg_efficiency']:.0f}")
    html = html.replace("%%SILHOUETTE%%", f"{stats['silhouette']:.2f}")
    
    with open(DASHBOARD_PATH, "w", encoding="utf-8") as f:
        f.write(html)
    logger.info(f"DAV Optimized Dashboard generated at {DASHBOARD_PATH}")

def main():
    try:
        df = load_and_clean_data()
        feature_df = build_features(df)
        scaler = StandardScaler()
        cols = ["receipts", "arrivals", "efficiency", "dependency", "gdp"]
        scaled = scaler.fit_transform(feature_df[cols])
        
        elbow_data = []
        for i in range(1, 8):
            km = KMeans(n_clusters=i, random_state=42, n_init=10)
            km.fit(scaled)
            elbow_data.append({"k": i, "inertia": float(km.inertia_)})
            
        k = 4
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        feature_df["cluster"] = kmeans.fit_predict(scaled)
        
        summary = feature_df.groupby("cluster").agg({
            "name": "count", "receipts": "mean", "arrivals": "mean", "efficiency": "mean"
        }).rename(columns={"name": "countries", "efficiency": "avg_spending_efficiency"}).reset_index()
        
        stats = {
            "count": len(feature_df),
            "total_receipts": feature_df["receipts"].sum(),
            "k": k,
            "avg_efficiency": feature_df["efficiency"].mean(),
            "silhouette": float(silhouette_score(scaled, feature_df["cluster"]))
        }
        
        OUTPUT_DIR.mkdir(exist_ok=True)
        generate_dashboard(feature_df, summary, elbow_data, stats)
        print(f"DONE: DAV Optimized Project Dashboard at {DASHBOARD_PATH}")
    except Exception as e:
        logger.error(f"Error: {e}")

if __name__ == "__main__":
    main()
