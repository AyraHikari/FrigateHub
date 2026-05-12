# Frigate Native Automation Server

Docker web server and MQTT listener for Frigate Native notifications.

It mirrors the Home Assistant blueprint flow in `home-assistant/new-frigate-automation.yaml`:

- listens to Frigate review MQTT messages, default `frigate/reviews`
- applies camera, severity, object, zone, ordered-zone, time, cooldown, and custom filters
- sends new, update, final, and GenAI notifications
- uses direct Frigate API media URLs such as `/api/events/<event_id>/thumbnail.jpg`
- posts notification payloads to your FCM REST API, default `https://ayra.eu.org/project/frigate/fcm`
- provides an internal password-protected settings page

## Run

1. Start the service:

   ```bash
   cd automation-server
   docker compose up -d --build
   ```

2. Open `http://localhost:5100`, log in with `ADMIN_PASSWORD`, and configure MQTT, direct Frigate API base URL, FCM API URL, and Frigate Native FCM tokens.

## Environment

- `ADMIN_PASSWORD`: internal web UI password.
- `APP_SECRET`: Flask session signing secret.
- `FRIGATE_AUTOMATION_CONFIG`: persisted JSON config path, defaults to `/data/config.json`.
