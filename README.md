# Marketplace (Client / Seller MERN App)

A full-stack marketplace where **sellers** can upload and manage products, while **clients** can browse products, add them to cart, and checkout using **Razorpay**. Authentication is JWT-based with role-based access control.

## Stack

* Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, Razorpay SDK
* Frontend: React (Vite), React Router, Axios, Razorpay Checkout.js
* Styling: CSS

## Folder structure

```text
marketplace/

  server/   -> Express API

  client/   -> React app

  package.json   -> Runs frontend and backend together
```

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

Then install the dependencies for both applications:

```bash
cd server
npm install

cd ../client
npm install

cd ..
```

### 2. Configure environment variables

Create a `.env` file inside the `server` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

* `MONGO_URI` — MongoDB connection string (local or Atlas)
* `JWT_SECRET` — a long random secret string
* `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay API credentials

Use **Razorpay Test Mode** keys while developing. Test payments do not charge real money.

### 3. Run the project

From the root `marketplace` folder:

```bash
npm run dev
```

This starts both the **backend and frontend with a single command**.

The backend runs on:

```text
http://localhost:5000
```

The frontend runs on the Vite development server:

```text
http://localhost:5173
```

## How it works

1. **Register** as either a `client` or `seller`. JWT authentication is used to identify the logged-in user, and protected API requests include the token as `Authorization: Bearer <token>`.

2. **Seller** logs in → accesses the seller dashboard → creates products with title, description, price, stock, and images. Products are associated with the seller's user ID, and seller routes are protected by role-based authorization.

3. **Client** logs in → browses products → searches products → adds items to the cart → proceeds to checkout.

4. During **checkout**, the backend validates the products and stock, calculates the order amount from the database, creates a Razorpay order, and sends the order details to the frontend.

5. **Razorpay Checkout** handles the payment. After payment, the frontend sends the Razorpay payment details to the backend, where the payment signature is verified using the Razorpay secret before the payment is marked as successful.

6. After successful payment, the order is saved as **paid** and the purchased product stock is reduced automatically.

7. Clients can view their previous purchases from **My Orders**.

## Test payments

The project uses **Razorpay Test Mode** for payment testing.

Test payments do not involve real money. Use the test payment details provided by Razorpay for the appropriate payment method.

## Security

* Passwords are securely hashed before being stored.
* JWT is used for authentication.
* Role-based access control protects client and seller routes.
* Seller product operations are protected server-side.
* Product prices and stock are validated on the backend.
* Razorpay payment signatures are verified server-side.
* Environment variables and secrets are excluded from Git.

## Things to extend next

* Move uploaded images to Cloudinary/S3 instead of local storage.
* Add product categories and pagination.
* Add seller order visibility.
* Add email confirmation after successful orders.
