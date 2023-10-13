# Online Shop Node.js Api

Welcome to the Online Shop Node.js MarketBlend! This comprehensive README.md file will guide you through the setup, features, and usage of this online shop.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Products](#products)
  - [Courses](#courses)
  - [Blogs](#blogs)
  - [Categories](#categories)
  - [GraphQL Section](#graphql-section)
  - [API Documentation with Swagger](#api-documentation-with-swagger)
  - [Payment Gateway](#payment-gateway)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [GraphQL Operations](#graphql-operations)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Redis (for caching)
- MongoDB (as the main database)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/mohamad-sh-dev/nodejs-shop-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nodejs-shop-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Project Structure

The project is organized as follows:

```
nodejs-marketBlend/
|-- app/
|   |-- graphQL/
|   |-- http/
|   |-- model/
|   |-- modules/
|   |-- router/
|   |-- utilities/
|-- document/
|   |-- config/
|   |-- paths/
|-- views/
|-- app.js
|-- package.json
|-- postman.collection.json.js
|-- README.md
```

- `app/`: Contains the main source code of the application.
- `http/`: Contains controllers middlewares validations for handling different entities (products, courses, blogs, etc.).
- `models/`: Defines data models for MongoDB or any other database you might be using.
- `routes/`: Defines API routes.
- `graphql/`: Implements GraphQL schema and resolvers.
- `app.js`: Entry point of the application.

## Features

### Products

- CRUD operations for products.
- Categorize products.

### Courses

- Structure courses with chapters and episodes.
- Easily manage and organize course content.

### Blogs

- Create and publish blogs.
- Assign blogs to specific categories.

### Categories

- Manage product, course, and blog categories.
- Organize content for better user experience.

### API Documentation with Swagger

MarketBlend provides detailed API documentation using Swagger. Swagger is a powerful tool for designing, building, documenting, and consuming RESTful APIs. Here's how to access the Swagger documentation:

1. **Run the Server:**
   ```bash
   npm start
   ```

2. **Access Swagger UI:**
   Open your browser and navigate to [http://localhost:8080/apiDocs](http://localhost:8080/apiDocs) to explore the interactive Swagger documentation.

Swagger allows you to:

- View and test API endpoints.
- Understand request and response formats.
- Explore available routes and operations.

This documentation is invaluable for developers, making it easier to integrate with the MarketBlend API seamlessly.

### GraphQL Section

- Perform CRUD operations on products and courses using GraphQL.
- Seamless integration for a dynamic shopping experience.
- Like , Dislike , Bookmark and Create Comment for blogs , products or courses 
- [See More Documents For GraphQL Section](https://github.com/mohamad-sh-dev/nodejs-shop-api/tree/develop/app/graphQL/document)

### Payment Gateway

MarketBlend uses ZarinPal as the default payment gateway, a widely used and trusted platform in [Iran](https://www.zarinpal.com/). ZarinPal supports various payment methods, providing a secure and seamless transaction experience for users.

In development mode, ZarinPal offers a sandbox environment for testing transactions without real financial implications. This is especially useful during the development and testing phase. To enable sandbox mode, follow the instructions in the [ZarinPal documentation](https://www.zarinpal.com/docs/technical-test).

## Usage

### Running the Server

```bash
npm start
```

This will start the server at `http://localhost:8080`.
</br>
You nedd provide a .env file for project config . without this file project does not work correctlly .
</br>

[Contact us for more information]()

### GraphQL Operations

Access the GraphQL playground at `http://localhost:8080/graphql` to interact with the GraphQL API. Use the provided schema documentation for reference.
you can see the document in the graphql palyground

### Role-Based Access Control (RBAC)

MarketBlend utilizes RBAC for access control. The following roles are available:

- **Admin**: Full access to all features and functionalities.
- **User**: Basic access for regular users, including browsing products, courses, and blogs.

Roles can be assigned and managed through the admin panel or directly in the database. Ensure proper role assignment for users based on your application's requirements.

## Future Plans

MarketBlend is an evolving project, and we have exciting plans for its future development. Here are some features we plan to add:


- **Chat System Integration**: Integrate a chat system to facilitate communication between users and providers. This will enhance user experience and provide a seamless way for customers to contact product or course providers.

- **Enhanced Security Measures**: Implement additional security measures to ensure the safety and privacy of user data. This may include encryption, authentication improvements, and regular security audits.

- **Internationalization (i18n)**: Add support for multiple languages to make the platform accessible to a broader audience.

- **Advanced Analytics**: Incorporate advanced analytics to gather insights into user behavior, popular products, and other valuable metrics. This information will help in making data-driven decisions.

- **Mobile Application Development**: Explore the development of a mobile application to provide users with a more convenient and on-the-go shopping experience.


These are just a few of the exciting features we have in mind. Stay tuned for updates as we continue to enhance and expand MarketBlend!


## Contributing

Feel free to contribute to the project. Fork the repository, make your changes, and submit a pull request. Your contributions are highly appreciated!

## License

This project is licensed under the [MIT License](LICENSE).
