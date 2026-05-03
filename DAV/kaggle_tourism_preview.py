try:
    import kagglehub
    from kagglehub import KaggleDatasetAdapter
except ImportError as exc:
    raise SystemExit(
        "kagglehub is not installed. Run: pip install -r requirements.txt"
    ) from exc


def main() -> None:
    file_path = "20- average-expenditures-of-tourists-abroad.csv"

    df = kagglehub.dataset_load(
        KaggleDatasetAdapter.PANDAS,
        "imtkaggleteam/tourism",
        file_path,
    )

    print("First 5 records:")
    print(df.head())


if __name__ == "__main__":
    main()