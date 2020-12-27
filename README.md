# LicenseManager-frontend ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/birdman98/LicenseManager-frontend/Build%20React.js%20application) ![GitHub](https://img.shields.io/github/license/birdman98/LicenseManager-frontend) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/birdman98/LicenseManager-frontend) ![GitHub all releases](https://img.shields.io/github/downloads/birdman98/LicenseManager-frontend/total) ![Lines of code](https://img.shields.io/tokei/lines/github/birdman98/LicenseManager-frontend) ![GitHub language count](https://img.shields.io/github/languages/count/birdman98/LicenseManager-frontend) ![GitHub top language](https://img.shields.io/github/languages/top/birdman98/LicenseManager-frontend)

Engineer's Thesis frontend project repository

## Getting started

1. Setting up SSL certificate for frontend

- You can use either provided self-signed certificate placed in [SSL](./frontend/ssl/) directory, which is pretty the same certificate as for backend, generate your own SSL certificate using OpenSSL tool or purchase your own SSL certificate from CA authority.

Corresponding certificate's files should be placed in [SSL](./frontend/ssl) directory.

2. Setting up Docker environment

To run production build of application with Nginx server through HTTPS in containerized
environment using docker-compose tool just navigate into project directory and run following command in your terminal

```
docker-compose --project-name license-manager up
```

Note that if you decided to use the same project name as for backend services, docker-compose will warn you about orphan containers, just ignore this warning, because backend services containers should still running.

You can also pass explicitly docker-compose config file by passing `-f/--file` argument followed by path to config file

```
docker-compose --project-name license-manager -f docker-compose.yaml up
```

To run containers in "detached" mode just add `-d` argument at the end of command.

```
docker-compose --project-name license-manager -f docker-compose.yaml up -d
```

To force containers rebuild use `--build argument`:

```
docker-compose --project-name license-manager -f docker-compose.yaml up --build
```

To stop all containers just run command:

```
docker-compose -f docker-compose.yaml down
```

**IMPORTANT NOTE**

- backend URL placed in [.env](./frontend/.env) file should be accessible from client's web browser. Hence you should make sure that URL is not pointing to localhost if you going to use app on other devices in network. It's recommended to use IP or hostname with port exposed by backend service container (port `9800`)
- if your browser refuses to send requests to server through HTTPS, just navigate into server's URL in your browser address bar and accept its certificate

If you want to run application locally, you have to prepare production build of application and serve it through static files server such as Nginx, Node, Apache or Serve. You can also run application in development mode by typing command `yarn start` in directory which contains [package.json](./frontend/package.json) file

### Credits

Some icons used in application was downloaded from https://www.flaticon.com/ site.
