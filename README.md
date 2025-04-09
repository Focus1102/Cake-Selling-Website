# Cake Selling Website 

A full-stack e-commerce platform specifically designed for a cake shop, featuring both customer-facing features and administrative capabilities.

## Features

- **User Features**
  - User registration and authentication
  - Product browsing and search
  - Shopping cart functionality
  - Order placement and tracking
  - Order history
  - User profile management

- **Admin Features**
  - Product management (CRUD operations)
  - Order management
  - User management
  - Dashboard with analytics

## Technology Stack

- **Frontend**
  - Vue 3.js
  - Vue Router for navigation
  - Vuex for state management
  - Axios for API calls
  - Swiper for carousels
  - FontAwesome for icons

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication
  - Nodemailer for email notifications

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd cakeshop
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

## Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend Development Server**
   ```bash
   # In a new terminal, from the root directory
   npm run serve
   ```

The application will be available at:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5001`

## Building for Production

To create a production build:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
