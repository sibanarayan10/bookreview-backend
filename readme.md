# 📚 Bookstore Backend API

A RESTful API for managing books, reviews, and ratings in an online bookstore. Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 🔧 Project Setup

### Prerequisites

- Node.js >= 14.x
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository

git clone https://github.com/your-username/bookstore-backend.git
cd bookstore-backend

### install dependecy

npm install

### start the server

npm run dev

### POST /api/v1/books

This endpoint retrieves a list of books based on the search query.

#### Request

- Method: POST
- URL: `http://localhost:3000/api/v1/books?search=lencho`
- Body (x-www-form-urlencoded):
  - `title` (text):
  - `price` (text):

#### Response

The response is a JSON object with the following schema:

```json
{
  "type": "object",
  "properties": {
    "statusCode": {
      "type": "number"
    },
    "message": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "author": {
            "type": "object",
            "properties": {
              "_id": {
                "type": "string"
              },
              "fullname": {
                "type": "string"
              }
            }
          },
          "price": {
            "type": "number"
          }
        }
      }
    },
    "success": {
      "type": "boolean"
    }
  }
}
```
