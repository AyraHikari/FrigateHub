<p align="center">
  <img alt="FrigateHub banner" src="assets/banner.png" />
</p>

# FrigateHub

FrigateHub is a native Android client for Frigate NVR with support for live viewing, reviews, exports, and smart notifications.

Built with Kotlin and Material You, the app focuses on fast media playback, multi-server support, and seamless integration with self-hosted Frigate instances.

## Download

- Currently being internal testing. [Send form to join the list!](https://docs.google.com/forms/d/e/1FAIpQLSeTMVgfwQEzTV-R1aZf-bU8xdn42_f0KiUQIM-TtR67dVBpcg/viewform?usp=publish-editor)

<p>
  <a href="https://play.google.com/store/apps/details?id=me.ayra.frigate">
    <img alt="Get it on Google Play" src="assets/googleplay.png" width="200">
  </a>
</p>

## Screenshots

<p align="center" width="100%">
  <img alt="FrigateHub screenshot 1" src="assets/SS1.png" width="25%">
  <img alt="FrigateHub screenshot 2" src="assets/SS2.png" width="25%">
  <img alt="FrigateHub screenshot 3" src="assets/SS4.png" width="25%">
  <img alt="FrigateHub screenshot 4" src="assets/SS5.png" width="25%">
  <img alt="FrigateHub screenshot 5" src="assets/SS6.png" width="25%">
  <img alt="FrigateHub screenshot 6" src="assets/SS7.png" width="25%">
</p>

## Features

- Material You interface
- Multi-server support
- Live camera streaming (RTSP/HLS)
- Review events, clips, snapshots, and exports
- MQTT and Firebase notifications
- Picture-in-picture playback
- Smart local/public URL switching
- Face recognition support
- Import/export app settings

## Requirements

- Android 8.0+
- Frigate NVR server
- Network access to your Frigate instance

## Notifications (Optional)

FrigateHub supports two notification methods:

| Method | Description |
|---|---|
| MQTT | Direct local notifications from the Android app |
| FCM | Push notifications through the automation server |

To run the companion automation server:

```bash
git clone https://github.com/AyraHikari/FrigateHub -o frigate-automation-server
cd frigate-automation-server
docker compose up -d --build
```

Open `http://localhost:5100` and sign in using the configured `ADMIN_PASSWORD`.

Then configure:
- Frigate MQTT settings
- FrigateHub FCM tokens

> [!TIP]
> All of your events data won't ever be saved on my server. It will go directly processed on Google Firebase Cloud Messaging API.
> You can opt-out to my server and change to your API server instead by changing fcm_api_url in the docker host.
> See [Privacy Policy](https://ayra.eu.org/project/frigate/privacy_policy) for more informations.

## Roadmap

### Completed

- Multi-account support
- Live camera streaming (RTSP/HLS)
- Reviews, clips, snapshots, and exports
- MQTT and Firebase notifications
- Face recognition support
- Timeline review viewer
- Import/export app data
- Material You theming
- Local/public URL switching

### In Progress

- Encrypted configuration storage
- Android Paging support
- Manual camera ordering
- Expanded automated testing
- RTSP/media performance improvements
- Public release preparation

### Planned

- Chromecast support
- License plate recognition UI
- Classification object/state UI

## Tech Stack

- Kotlin
- AndroidX AppCompat, Navigation, ConstraintLayout, ViewBinding
- Material Components
- AndroidX Media3 ExoPlayer, RTSP, and HLS
- OkHttp and NiceHttp
- Glide
- Kotlinx Serialization and Jackson Kotlin
- Eclipse Paho MQTT
- Firebase Cloud Messaging
