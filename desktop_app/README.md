# DAVCOM Message Desk

This is a small standalone C++17 desktop client for sending a message to DAVCOM Mining Resources. It uses the same `/api/contact` endpoint as the website, so successful submissions are saved in the company database and trigger the existing email notification.

The folder also contains a native Qt GUI version, `davcom-message-gui`, with editable fields and a Send button.

## Build

Requirements:

- Linux or another POSIX-compatible system
- `g++` with C++17 support
- The DAVCOM web server running locally

```sh
cd desktop_app
make
```

## Run

Start the company application from the repository root in another terminal:

```sh
npm install
npm run dev
```

Then run the client:

```sh
./desktop_app/davcom-message-desk
```

## Build the GUI version

Install Qt 6 development packages and CMake, then build from this folder:

```sh
cmake -S . -B build
cmake --build build
./build/davcom-message-gui
```

On Ubuntu/Debian, the prerequisites are typically available through `build-essential`, `cmake`, `qt6-base-dev`, and `qt6-base-dev-tools`.

The default API URL is `http://127.0.0.1:3000/api/contact`. For a deployed HTTP API, configure it before starting the app:

```sh
DAVCOM_API_URL=http://your-server.example/api/contact ./desktop_app/davcom-message-desk
```

The current client intentionally supports HTTP only and does not embed credentials. HTTPS support should be added with a TLS-capable HTTP library before pointing it at a public internet endpoint.