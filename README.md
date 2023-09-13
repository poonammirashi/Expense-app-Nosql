# Expense-app-Nosql

An Expense Tracker web application that allows users to manage their expenses. This app is built with Node.js, Express, MongoDB, and Mongoose. It also includes a "Forgot Password" feature for account recovery.
## go live 
   https://expense-tracker-app-o6bo.onrender.com/login/login.html

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **User Registration and Login**: Users can create accounts, log in, and securely manage their expenses.

- **Expense Management**: Users can add, edit, view, and delete their expenses.

- **Total Expense Calculation**: The app calculates the total expenses for each user.

- **Forgot Password**: Includes a "Forgot Password" feature that allows users to reset their password via email.

- **Responsive Design**: The app is responsive and works well on different devices and screen sizes.

## Technologies Used

- **Node.js**: A JavaScript runtime for building the server-side of the application.
- **Express.js**: A web application framework for Node.js, used for creating robust APIs and handling routes.
- **MongoDB**: A NoSQL database for storing user and expense data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **HTML5 and CSS3**: Used for the app's frontend design and structure.
- **JavaScript**: For client-side scripting and interaction.
- **sendinblue**: Used for sending password reset emails.
- **jwt token**: For user authentication.

## Installation

Follow these steps to set up and run the Expense Tracker app locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Expense-app-Nosql.git
   cd Expense-app-Nosql
   npm install
   
   make file and set up environmental variables
## Usage
   Register for a new account or log in if you already have one.

   Add your expenses and categorize them.

   Use the "Forgot Password" feature if you ever forget your password. An email with a password reset link will be sent to your registered email address.

   Manage your expenses and delete them as needed.

## Folder Structure
   The project follows this folder structure:

   /config: Contains configuration files for Passport authentication, database setup, and environment variables.

   /models: Defines Mongoose models for User and Expense data.

   /routes: Defines routes for handling user authentication, expense management, and password recovery.

   /views: Contains EJS templates for rendering dynamic pages.

   /public: Stores static assets like stylesheets, client-side JavaScript, and images.

   /controllers: Handles logic for routes and interacts with the database.

## Contributing
   Contributions are welcome! If you want to contribute to this project, please follow these guidelines:

   Fork the repository.

   Create a new branch for your feature: git checkout -b feature-name

   Commit your changes: git commit -m 'Add new feature'

   Push to the branch: git push origin feature-name

   Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

   Acknowledgments
   Node.js
   Express.js
   MongoDB
   Mongoose
   sendinblue
   jwt token
