# Alert Handling

## Requirements

-   Alert Source (e.g., Panther)
-   Slack
-   Jira

Visit our [documentation](https://docs.admyral.dev/) for setup instructions.

## Setup

1. Install all the dependencies:

```bash
$ poetry install
```

2. Make sure that an Admyral instance is running. If you are running Admyral locally, you also need use a tunneling servce like [ngrok](https://ngrok.com/) to expose the Admyral instance to the internet, so that you can receive events from Slack. If you are using ngrok and run Admyral locally on port 8000, simply run:

```bash
$ ngrok http 8000
```

Also, make sure to use the forwarding URL in the Slack API interactivity configuration as a domain.

3. Configure the Slack channel IDs in the following files (i.e., resolve the TODOs for `TODO(user)`):

-   `workflows/panther_alert_handling.py`

3. Push the workflows:

```bash
$ admyral workflow push panther_alert_handling -f workflows/panther_alert_handling.py --activate
$ admyral workflow push slack_interactivity -f workflows/panther_slack_interactivity.py --activate
```

4. Test the workflows by triggering them manually:

```bash
$ admyral workflow trigger panther_alert_handling --payload '{
  "alert": {
    "id": "AWS.ALB.HighVol400s",
    "severity": "Medium",
    "timestamp": "2024-08-14T14:45:32Z",
    "source": "AWS ALB",
    "rule": "AWS.ALB.HighVol400s",
    "environment": "Production",
    "region": "us-east-1",
    "account": "112233445566",
    "description": "This rule tracks abuse to web ports via AWS Load Balancers",
    "event_details": {
      "elb": "app/web/22222f55555e618c",
      "actions_executed": ["forward"],
      "source_ip": "192.0.2.45",
      "target_port": 80,
      "elb_status_code": 429,
      "target_status_code": 429,
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "request_url": "https://ec2-55-22-444-111.us-east-1.compute.amazonaws.com:443/pagekit/index.php",
      "domain_name": "example.com"
    },
    "mitre_attack": {
      "tactic": "Impact",
      "technique": "T1499"
    },
    "title": "High volume of web port 4xx errors to [example.com] in account [112233445566]",
    "recommendations": [
      "Correlate the source IP to find matches from other triggered rules.",
      "Check which path is being requested to see if it is particularly sensitive.",
      "Check if the source IP is known bad through threat intelligence integrations.",
      "Check if the load balancer availability was affected.",
      "Check if the source IP is part of a known botnet.",
      "Check if this volume of 400 errors is typical or not for that load balancer."
    ],
    "deduplication": {
      "threshold": 50,
      "dedup_period_minutes": 5
    }
  }
}'
```