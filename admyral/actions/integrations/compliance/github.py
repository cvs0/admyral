"""
Setup:
Follow setup instruction from the github documentation to create personal access token
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
"""

from typing import Annotated
from httpx import Client

from admyral.action import action, ArgumentMetadata
from admyral.context import ctx
from admyral.typings import JsonValue


def get_github_enterprise_client(access_token: str, enterprise: str) -> Client:
    return Client(
        base_url=f"https://api.github.com/enterprises/{enterprise}",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json",
        },
    )


@action(
    display_name="Query Organizaton Audit Logs",
    display_namespace="GitHub",
    description="Query GitHub audit logs for enterprise",
    secrets_placeholders=["GITHUB_ENTERPRISE_SECRET"],
)
def search_github_audit_logs(
    enterprise: Annotated[
        str,
        ArgumentMetadata(
            display_name="Enterprise",
            description="Enterprise to query audit logs for",
        ),
    ],
    filter: Annotated[
        str,
        ArgumentMetadata(
            display_name="Filter",
            description="Filter to apply to the query",
        ),
    ] = None,
    start_time: Annotated[
        str | None,
        ArgumentMetadata(
            display_name="Start Time",
            description="The start time for the cases to list. Must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).",
        ),
    ] = None,
    end_time: Annotated[
        str | None,
        ArgumentMetadata(
            display_name="End Time",
            description="The end time for the cases to list. Must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).",
        ),
    ] = None,
    limit: Annotated[
        int,
        ArgumentMetadata(
            display_name="Limit",
            description="Maximum number of logs to return",
        ),
    ] = 100,
) -> list[dict[str, JsonValue]]:
    secret = ctx.get().secrets.get("GITHUB_ENTERPRISE_SECRET")
    access_token = secret["access_token"]

    # https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#query-for-dates
    #
    with get_github_enterprise_client(access_token, enterprise) as client:
        params = {"order": "asc", "per_page": 100}
        if filter:
            params["phrase"] = filter

        if start_time and end_time:
            params["created"] = f"{start_time}..{end_time}"

        elif start_time:
            params["created"] = f">={start_time}"

        elif end_time:
            params["created"] = f"<={end_time}"

        url = "/audit-log"
        events = []
        while len(events) < limit:
            response = client.get(
                url,
                params=params,
            )
            response.raise_for_status()
            events.extend(response.json())

            if "next" in response.links:
                url = response.links["next"]["url"][len(str(client.base_url)) :]
                params = None
            else:
                break

        return events[:limit]