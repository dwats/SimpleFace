module.exports = [
  {
    "type": "heading",
    "defaultValue": "Simple Face Settings"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Wunderground API Key"
      },
      {
        "type": "input",
        "messageKey": "apiKey",
        "defaultValue": "",
        "label": "Key",
        "attributes": {
          "placeholder": "eg: 1ab2345c6d78e90f"
        }
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Weather Station"
      },
      {
        "type": "input",
        "messageKey": "station",
        "label": "Station ID",
        "attributes": {
          "placeholder": "eg: KCASANFR70"
        }
      },
      {
        "type": "toggle",
        "messageKey": "useStation",
        "label": "Use Station",
        "description": "If disabled your current location will be used.",
        "defaultValue": true
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "General Options"
      },
      {
        "type": "toggle",
        "messageKey": "useMetricTemp",
        "label": "Use Metric Temperature",
        "defaultValue": true
      },
      {
        "type": "toggle",
        "messageKey": "useMetricWind",
        "label": "Use Metric Wind Speed",
        "defaultValue": true
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  }
];