# Bookstore API Documentation

## Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bookstore-api.git
   cd bookstore-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## How to Run Locally

```bash
npm install
npm run dev
```

The server will start on `http://localhost:3000`.

---

#### API Endpoints

### POST /api/v1/users/signup

This endpoint registers a new user.

**Request**

Method: POST

```bash
curl -X POST "http://localhost:3000/api/v1/user/signup"
```

**Request**

```

Body (JSON):
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "phone":"9078132csc",
}

```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "user created successfully",
  "data": [
    {
      "_id": "userid",
      "fullname": "Book Title",
      "email": "email",
      "password": "encryptedOne"
    }
  ],
  "success": true
}
```

### POST /api/v1/users/login

This endpoint login a user.

**Request**

Method: POST

```bash
curl -X POST "http://localhost:3000/api/v1/user/login"
```

**Request**

```

Body (JSON):
{
  "email": "john@example.com",
  "password": "yourpassword",
}

```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": [
    {
      "_id": "userid",
      "fullname": "Book Title",
      "email": "email",
      "phone": "phoneNumber",
      "createdAt": "creationTime",
      "updatedAt": "updationTime"
    }
  ],
  "success": true
}
```

### POST /api/v1/books

```bash

curl -X POST "http://localhost:3000/api/v1/books?search=lencho"
```

**Request**

```BODY json
{"title":"book_name",
"price":50,}
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "review created successfully",
  "data": [
    {
      "_id": "book_id",
      "title": "Book Title",
      "author": {
        "_id": "author_id"
      },
      "price": 20
    }
  ],
  "success": true
}
```

---

### GET /api/v1/books

```bash

curl -X GET "http://localhost:3000/api/v1/books?search=lencho"
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "book fetched successfully",
  "data": [
     {
      "_id": "book_id",
      "title": "Book Title",
      "author": {
        "_id": "author_id",
        "fullname": "Author Name"
      },
      "price": 20
    }
    ....
    ],
  "success": true
}
```

---

### GET /api/v1/books/:id

**Request**

```bash
curl -X GET "http://localhost:3000/api/v1/books/BOOK_ID"
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": {
    "avgRating": "4.5",
    "resReview": [
      {
        "author": "John Doe",
        "context": "Great book!"
      }
    ]
  }
}
```

---

### POST /api/v1/books/:id/reviews

**Request**

```bash
curl -X POST "http://localhost:3000/api/v1/books/BOOK_ID/reviews" -H "Content-Type: application/json" -d '{"context": "Excellent read!"}'
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review created successfully",
  "data": {
    "_id": "review_id",
    "context": "Excellent read!",
    "reviewedBy": "user_id",
    "reviewedOn": "book_id",
    "createdAt": "time"
  }
}
```

---

### DELETE /api/v1/review/:id

**Request**

```bash
curl -X DELETE "http://localhost:3000/api/v1/review/REVIEW_ID"
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review updated successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  }
}
```

### UPDATE /api/v1/review/:id

**Request**

```bash
curl -X UPDATE "http://localhost:3000/api/v1/review/REVIEW_ID"
```

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review updated successfully",
  "data": {
    "_id": "id",
    "context": "context",
    "updatedAt": "2025-05-19T18:32:57.049Z"
  }
}
```

---

## Design Decisions

- Used `populate()` for author lookup instead of resolving promises manually.
- Ratings are averaged using `.length` check to avoid division by zero.
- Lean queries are used for performance.
- API response structure is standardized using `ApiResponse` and `ApiError`.

### SCHEMA DESIGN

## Addtion models

- `Review` model has been added to store reviews.
- `Rating` model has been added to store ratings.
- `User` model has been added to store users.
- `Product` model has been added to store products.

## USER MODEL

- user model is enabled to hash the password before saving it to the database
- user model is enabled to generate a token for the user after registration

## BOOK MODEL

- Book model contain some field of title,author,price
- It do have a text index at title and index at author for better search perfomance

## REVIEW MODEL

- Review model contain some field like reviewedBy, reviewedOn, context
- It do have a index at reviewedBy and reviewedOn for better search perfomance

## RATING MODEL

- Rating model contain some field like ratingBy, ratingOn, rating
- It do have a index at ratingBy and ratingOn for better search perfomance

# For schema visualization

```bash
curl -X  "https://www.prismabuilder.io/schemas/New%20schema/graph"
```
