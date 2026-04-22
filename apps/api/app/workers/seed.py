from app.services.data_store import get_data_store


def main() -> None:
    ds = get_data_store()
    print("Loaded seeded datasets:")
    print(f"- Pull requests: {len(ds.pull_requests())}")
    print(f"- Releases: {len(ds.releases())}")
    print(f"- Policies: {len(ds.policies())}")
    print(f"- Services: {len(ds.services())}")


if __name__ == "__main__":
    main()
