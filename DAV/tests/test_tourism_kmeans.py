"""Unit tests for tourism_kmeans module.

Tests core functions for data integrity, feature engineering, and clustering.
Run with: python -m pytest tests/test_tourism_kmeans.py -v

"""

import numpy as np
import pandas as pd
import pytest
from pathlib import Path
import sys

# Add parent directory to path for importing tourism_kmeans
sys.path.insert(0, str(Path(__file__).parent.parent))

from tourism_kmeans import (
    build_country_features,
    prepare_features,
    find_best_k,
    fit_clusters,
    build_cluster_summary,
)


class TestFeatureEngineering:
    """Test suite for feature engineering pipeline."""

    @pytest.fixture
    def sample_time_series_data(self):
        """Create synthetic tourism expenditure time-series data."""
        np.random.seed(42)
        
        # Create 3 countries × 10 years of expenditure data
        years = list(range(2010, 2020))
        countries = [
            {"Entity": "CountryA", "Code": "CA", "Year": y, 
             "Outbound Tourism Expenditure (adjusted for US 2021 inflation)": 1e9 + (y - 2010) * 1e7}
            for y in years
        ]
        countries += [
            {"Entity": "CountryB", "Code": "CB", "Year": y, 
             "Outbound Tourism Expenditure (adjusted for US 2021 inflation)": 5e9 - (y - 2010) * 5e7}
            for y in years
        ]
        countries += [
            {"Entity": "CountryC", "Code": "CC", "Year": y, 
             "Outbound Tourism Expenditure (adjusted for US 2021 inflation)": 2e9}
            for y in years
        ]
        
        return pd.DataFrame(countries)

    def test_build_country_features_output_shape(self, sample_time_series_data):
        """Test that feature engineering produces correct shape."""
        features = build_country_features(sample_time_series_data)
        
        assert len(features) == 3  # 3 countries
        assert "cluster" not in features.columns  # No cluster label yet
        assert "Entity" in features.columns
        assert "Code" in features.columns
        
    def test_build_country_features_required_columns(self, sample_time_series_data):
        """Test that all 14 engineered features are present."""
        features = build_country_features(sample_time_series_data)
        
        required_features = [
            "years_covered", "first_year", "last_year",
            "start_expenditure", "end_expenditure", "avg_expenditure",
            "median_expenditure", "min_expenditure", "max_expenditure",
            "expenditure_std", "absolute_growth", "growth_rate_percent",
            "expenditure_slope"
        ]
        
        for feature in required_features:
            assert feature in features.columns, f"Missing feature: {feature}"

    def test_build_country_features_no_nulls(self, sample_time_series_data):
        """Test that feature engineering fills missing values."""
        features = build_country_features(sample_time_series_data)
        
        # No NaN values should remain
        assert not features.isna().any().any(), "Feature engineering left NaN values"

    def test_build_country_features_growth_calculation(self, sample_time_series_data):
        """Test that growth metrics are calculated correctly."""
        features = build_country_features(sample_time_series_data)
        
        # CountryA: growing (1e9 to 1.09e9), should have positive growth
        country_a = features[features["Entity"] == "CountryA"].iloc[0]
        assert country_a["absolute_growth"] > 0, "CountryA should show positive growth"
        assert country_a["growth_rate_percent"] > 0, "CountryA growth rate should be positive"
        
        # CountryB: declining (5e9 to 4.1e9), should have negative growth
        country_b = features[features["Entity"] == "CountryB"].iloc[0]
        assert country_b["absolute_growth"] < 0, "CountryB should show negative growth"
        assert country_b["growth_rate_percent"] < 0, "CountryB growth rate should be negative"


class TestFeaturePreparation:
    """Test suite for feature standardization."""

    @pytest.fixture
    def sample_features(self):
        """Create sample country features."""
        data = {
            "Entity": ["A", "B", "C"],
            "Code": ["AA", "BB", "CC"],
            "years_covered": [25, 27, 26],  # Varied
            "first_year": [1996, 1995, 1995],  # Varied
            "last_year": [2021, 2021, 2021],
            "start_expenditure": [1e9, 5e9, 2e9],
            "end_expenditure": [2e9, 3e9, 2.5e9],
            "avg_expenditure": [1.5e9, 4e9, 2.2e9],
            "median_expenditure": [1.5e9, 4e9, 2.2e9],
            "min_expenditure": [1e9, 2e9, 1.5e9],
            "max_expenditure": [2e9, 5e9, 3e9],
            "expenditure_std": [0.3e9, 1e9, 0.5e9],
            "absolute_growth": [1e9, -2e9, 0.5e9],
            "growth_rate_percent": [100, -40, 25],
            "expenditure_slope": [40e6, -100e6, 20e6],
        }
        return pd.DataFrame(data)

    def test_prepare_features_standardization(self, sample_features):
        """Test that features are properly standardized."""
        scaled, _ = prepare_features(sample_features)
        
        # Check means are ~0
        means = scaled.mean(axis=0)
        assert np.allclose(means, 0, atol=1e-10), "Scaled features should have mean ~0"
        
        # Check stds are ~1 for non-zero-variance features
        stds = scaled.std(axis=0, ddof=0)
        non_zero_stds = stds[stds > 0]
        assert np.allclose(non_zero_stds, 1, atol=1e-10), f"Non-zero std features should be ~1, got {non_zero_stds}"

    def test_prepare_features_column_names(self, sample_features):
        """Test that feature column names are preserved."""
        _, feature_names = prepare_features(sample_features)
        
        expected_names = [
            "years_covered", "first_year", "last_year",
            "start_expenditure", "end_expenditure", "avg_expenditure",
            "median_expenditure", "min_expenditure", "max_expenditure",
            "expenditure_std", "absolute_growth", "growth_rate_percent",
            "expenditure_slope"
        ]
        
        assert feature_names == expected_names, "Feature column names don't match"

    def test_prepare_features_output_shape(self, sample_features):
        """Test that prepare_features preserves sample count."""
        scaled, _ = prepare_features(sample_features)
        
        assert len(scaled) == len(sample_features), "Row count should be preserved"
        assert scaled.shape[1] == 13, "Should have 13 features"


class TestClustering:
    """Test suite for K-Means clustering functions."""

    @pytest.fixture
    def sample_scaled_features(self):
        """Create sample scaled features for clustering."""
        np.random.seed(42)
        
        # Create 20 points: 10 near (0,0) and 10 near (5,5)
        cluster_0 = np.random.normal(0, 0.5, (10, 13))
        cluster_1 = np.random.normal(5, 0.5, (10, 13))
        features = np.vstack([cluster_0, cluster_1])
        
        feature_names = [
            "f1", "f2", "f3", "f4", "f5", "f6", "f7",
            "f8", "f9", "f10", "f11", "f12", "f13"
        ]
        
        return pd.DataFrame(features, columns=feature_names)

    def test_find_best_k_output_structure(self, sample_scaled_features):
        """Test that find_best_k returns expected dictionary structure."""
        scores = find_best_k(sample_scaled_features, min_k=2, max_k=4)
        
        assert len(scores) == 3, "Should evaluate 3 k values (2, 3, 4)"
        
        for score in scores:
            assert "k" in score, "Missing 'k' in score dict"
            assert "inertia" in score, "Missing 'inertia' in score dict"
            assert "silhouette" in score, "Missing 'silhouette' in score dict"

    def test_find_best_k_silhouette_range(self, sample_scaled_features):
        """Test that silhouette scores are in valid range."""
        scores = find_best_k(sample_scaled_features, min_k=2, max_k=4)
        
        for score in scores:
            silhouette = score["silhouette"]
            assert -1 <= silhouette <= 1, f"Silhouette score out of range: {silhouette}"

    def test_fit_clusters_label_integrity(self, sample_scaled_features):
        """Test that fit_clusters assigns valid cluster labels."""
        model, labels = fit_clusters(sample_scaled_features, n_clusters=2)
        
        # All labels should be 0 or 1
        assert set(labels) == {0, 1}, "Should have exactly 2 cluster labels"
        
        # Each label should appear at least once
        assert np.sum(labels == 0) > 0, "Cluster 0 should have at least one point"
        assert np.sum(labels == 1) > 0, "Cluster 1 should have at least one point"

    def test_fit_clusters_model_properties(self, sample_scaled_features):
        """Test K-Means model properties."""
        model, _ = fit_clusters(sample_scaled_features, n_clusters=2)
        
        assert model.n_clusters == 2, "Model should have 2 clusters"
        assert model.cluster_centers_.shape[0] == 2, "Should have 2 centroids"
        assert model.cluster_centers_.shape[1] == 13, "Centroids should have 13 features"


class TestClusterSummary:
    """Test suite for cluster summary generation."""

    @pytest.fixture
    def sample_clustered_data(self):
        """Create sample clustered country data."""
        data = {
            "Entity": ["A", "B", "C", "D"],
            "Code": ["AA", "BB", "CC", "DD"],
            "years_covered": [27, 27, 27, 27],
            "first_year": [1995, 1995, 1995, 1995],
            "last_year": [2021, 2021, 2021, 2021],
            "start_expenditure": [1e9, 5e9, 2e9, 3e9],
            "end_expenditure": [2e9, 3e9, 2.5e9, 4e9],
            "avg_expenditure": [1.5e9, 4e9, 2.2e9, 3.5e9],
            "median_expenditure": [1.5e9, 4e9, 2.2e9, 3.5e9],
            "min_expenditure": [1e9, 2e9, 1.5e9, 2.5e9],
            "max_expenditure": [2e9, 5e9, 3e9, 4.5e9],
            "expenditure_std": [0.3e9, 1e9, 0.5e9, 0.7e9],
            "absolute_growth": [1e9, -2e9, 0.5e9, 1e9],
            "growth_rate_percent": [100, -40, 25, 33],
            "expenditure_slope": [40e6, -100e6, 20e6, 40e6],
            "cluster": [0, 0, 1, 1],
        }
        return pd.DataFrame(data)

    def test_build_cluster_summary_shape(self, sample_clustered_data):
        """Test that cluster summary has correct shape."""
        summary = build_cluster_summary(sample_clustered_data)
        
        assert len(summary) == 2, "Should have summary for 2 clusters"
        assert summary["cluster"].tolist() == [0, 1], "Cluster labels should be 0, 1"

    def test_build_cluster_summary_required_columns(self, sample_clustered_data):
        """Test that cluster summary has all required aggregates."""
        summary = build_cluster_summary(sample_clustered_data)
        
        required_cols = [
            "cluster", "countries", "avg_years_covered", "avg_start_expenditure",
            "avg_end_expenditure", "avg_expenditure", "avg_growth",
            "avg_growth_rate_percent", "avg_trend_slope",
            "total_latest_expenditure", "latest_expenditure_share_percent"
        ]
        
        for col in required_cols:
            assert col in summary.columns, f"Missing column: {col}"

    def test_build_cluster_summary_revenue_share_sums_to_100(self, sample_clustered_data):
        """Test that revenue share percentages sum to 100."""
        summary = build_cluster_summary(sample_clustered_data)
        
        total_share = summary["latest_expenditure_share_percent"].sum()
        assert np.isclose(total_share, 100.0), f"Revenue share should sum to 100, got {total_share}"

    def test_build_cluster_summary_country_count(self, sample_clustered_data):
        """Test that country counts are accurate."""
        summary = build_cluster_summary(sample_clustered_data)
        
        assert summary.loc[summary["cluster"] == 0, "countries"].values[0] == 2
        assert summary.loc[summary["cluster"] == 1, "countries"].values[0] == 2


# Edge case tests
class TestEdgeCases:
    """Test suite for error handling and edge cases."""

    def test_build_country_features_missing_column(self):
        """Test error handling for missing required column."""
        data = pd.DataFrame({
            "Entity": ["A"],
            "Code": ["AA"],
            "Year": [2021],
            # Missing EXPENDITURE_COLUMN
        })
        
        with pytest.raises(KeyError):
            build_country_features(data)

    def test_prepare_features_missing_column(self):
        """Test error handling for missing engineered feature."""
        data = {
            "Entity": ["A"],
            "Code": ["AA"],
            # Missing all required features
        }
        
        with pytest.raises(ValueError):
            prepare_features(pd.DataFrame(data))

    def test_fit_clusters_invalid_k(self):
        """Test error handling for invalid cluster count."""
        features = pd.DataFrame(np.random.rand(5, 3), columns=["f1", "f2", "f3"])
        
        # n_clusters >= number of samples should raise
        with pytest.raises(ValueError):
            fit_clusters(features, n_clusters=5)

    def test_build_cluster_summary_missing_cluster_column(self):
        """Test error handling for missing cluster label."""
        data = {
            "Entity": ["A"],
            "end_expenditure": [1e9],
            # Missing cluster column
        }
        
        with pytest.raises(KeyError):
            build_cluster_summary(pd.DataFrame(data))


if __name__ == "__main__":
    # Run tests with: python -m pytest tests/test_tourism_kmeans.py -v
    pytest.main([__file__, "-v"])
