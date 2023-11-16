# Announcraze

Announcraze is a platform for creating and managing product announcements in France. It allows users to upload product pictures, create product descriptions, and manage their product listings.

## Features

- User authentication, with password resetting and secured e-mail
- Product creation, update, and deletion
- Simple Bid feature for products
- Interactive bidding system, allowing users to place and update bids, and allowing sellers to update, accept or reject them. 
- Role-based access control

## Direct Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory of the project. You can use the `.env.example` file as a guide.
4. Start the server: `npm start`

### Docker Installation

1. Clone the repository
2. Build the Docker image: `docker build -t announcraze .`
3. Run the Docker container, replacing `<env_var>` with your actual environment variables: `docker run -p 3000:3000 -d -e MONGO_URI=<env_var> -e JWT_SECRET=<env_var> -e SMTP2GO_USER=<env_var> -e SMTP2GO_PASSWORD=<env_var> -e APP_BASEURL=<env_var> announcraze`

## Usage

After starting the server, you can interact with the API using a tool like Postman or curl. The API documentation is available at `http://localhost:3000/api/v1/docs`.