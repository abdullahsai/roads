# Roads Webapp

This is a simple Node.js/Express web application with an SQLite database for managing items. Each item consists of:

- **Category**
- **Description**
- **Unit of measurement**
- **Cost per unit**

The main page allows you to add items and shows the last five entries. A second page at `/report` lets you select items and save damage reports.


## Development

1. Install dependencies:
   ```bash
   npm install
   ```
   
   Node.js 18 or newer is recommended.

2. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

## Docker

Build and run using Docker:
```bash
docker build -t roads-app .
docker run -p 3000:3000 roads-app
```

## Deploying with CapRover

1. Push this repository to your GitHub account.
2. From your CapRover dashboard, create a new app.
3. In the app settings, enable deployment via Git and follow the instructions to connect the repository.
4. Deploy the app; CapRover will build the Dockerfile and run the container.

For more details, see the [CapRover documentation](https://caprover.com/docs/complete-webapp-tutorial.html).
