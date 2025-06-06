# Declutta API Documentation

Welcome to the Declutta API! This documentation provides an overview of all available endpoints, authentication methods, and usage examples for integrating with the Declutta backend.

PROD URL: https://declutta-backend.onrender.com/

---

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Public Endpoints](#public-endpoints)
- [Protected Endpoints](#protected-endpoints)
- [Swagger & OpenAPI Docs](#swagger--openapi-docs)
- [Contact & Support](#contact--support)

---

## Introduction
Declutta is a platform for managing products, categories, reviews, users, chats, payments, and more. This API allows you to interact programmatically with all Declutta features.

All endpoints return JSON responses. For protected endpoints, you must provide a valid Bearer token in the `Authorization` header.

---

## Authentication

Some endpoints require authentication. To access these, include the following header in your requests:

```
Authorization: Bearer <your_token>
```

### Authentication Endpoints
| Method | Endpoint                              | Description                       |
|--------|---------------------------------------|-----------------------------------|
| POST   | /api/auth/signup                      | Register a new user               |
| POST   | /api/auth/login                       | Login a user                      |
| POST   | /api/auth/forgot-password             | Request a password reset          |
| POST   | /api/auth/reset-password              | Reset password                    |
| POST   | /api/auth/verify-email                | Verify email address              |
| POST   | /api/auth/resend-verification-code    | Resend email verification code    |

#### Example: Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

---

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message here",
  "status": 400
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Public Endpoints

### Root
| Method | Endpoint | Description            |
|--------|----------|------------------------|
| GET    | /        | Returns welcome message|

### Categories
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/categories         | List all categories   |
| GET    | /api/categories/{id}    | Get a single category |

### Products
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/products           | List all products     |
| GET    | /api/products/{id}      | Get a single product  |

### Reviews
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/reviews            | List all reviews      |
| GET    | /api/reviews/{id}       | Get a single review   |

### Users
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/users              | List all users        |

### Database Backup
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/backup-db          | Trigger DB backup     |

---

## Protected Endpoints

> **Note:** All protected endpoints require authentication via Bearer token.

### Users
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| PUT    | /api/users/{id}         | Update user           |
| GET    | /api/users/{id}         | Get user by ID        |

### Categories
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /api/categories         | Create a category     |
| PUT    | /api/categories/{id}    | Update a category     |
| DELETE | /api/categories/{id}    | Delete a category     |

### Products
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /api/products           | Create a product      |
| PUT    | /api/products/{id}      | Update a product      |
| DELETE | /api/products/{id}      | Delete a product      |

### Reviews
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /api/reviews            | Create a review       |
| PUT    | /api/reviews/{id}       | Update a review       |
| DELETE | /api/reviews/{id}       | Delete a review       |

### Images
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /api/images             | Upload an image       |
| DELETE | /api/images/{id}        | Delete an image       |

### Favourite Products
| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | /api/favourites         | List favourite products        |
| POST   | /api/favourites         | Add a product to favourites    |
| DELETE | /api/favourites/{id}    | Remove a product from favourites|

### Wants
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/wants              | List wants            |
| POST   | /api/wants              | Create a want         |
| GET    | /api/wants/{id}         | Get a want            |
| PUT    | /api/wants/{id}         | Update a want         |
| DELETE | /api/wants/{id}         | Delete a want         |

### Chats
| Method | Endpoint                        | Description                       |
|--------|----------------------------------|-----------------------------------|
| GET    | /api/chats/conversations        | List chat conversations           |
| GET    | /api/chats                      | List chat messages (filterable)   |
| POST   | /api/chats                      | Send a chat message               |
| POST   | /api/chats/mark-as-read         | Mark chat messages as read        |

### Bank Accounts
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/bank-accounts      | List bank accounts    |
| POST   | /api/bank-accounts      | Add a bank account    |
| GET    | /api/bank-accounts/{id} | Get a bank account    |
| PUT    | /api/bank-accounts/{id} | Update a bank account |
| DELETE | /api/bank-accounts/{id} | Delete a bank account |

### Cards
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/cards              | List cards            |
| POST   | /api/cards              | Add a card            |
| GET    | /api/cards/{id}         | Get a card            |
| PUT    | /api/cards/{id}         | Update a card         |
| DELETE | /api/cards/{id}         | Delete a card         |

### Shipping Addresses
| Method | Endpoint                        | Description               |
|--------|----------------------------------|---------------------------|
| GET    | /api/shipping-addresses          | List shipping addresses   |
| POST   | /api/shipping-addresses          | Add a shipping address    |
| GET    | /api/shipping-addresses/{id}     | Get a shipping address    |
| PUT    | /api/shipping-addresses/{id}     | Update a shipping address |
| DELETE | /api/shipping-addresses/{id}     | Delete a shipping address |

### Notifications
| Method | Endpoint                                | Description                   |
|--------|-----------------------------------------|-------------------------------|
| GET    | /api/notifications                      | List notifications            |
| GET    | /api/notifications/unread               | List unread notifications     |
| POST   | /api/notifications/{id}/read            | Mark a notification as read   |
| POST   | /api/notifications                      | Create a notification         |
| DELETE | /api/notifications/{id}                 | Delete a notification         |

### Checkout / Orders
| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| POST   | /api/checkout           | Checkout                      |
| POST   | /api/paystack/webhook   | Paystack webhook endpoint      |
| GET    | /api/orders/{id}        | Get order by ID                |

---

## Swagger & OpenAPI Docs

- **GET /swagger**: Returns OpenAPI docs (JSON)
- **GET /docs**: Returns Swagger UI

You can use these endpoints to explore and test the API interactively.

---

## Contact & Support

For questions, issues, or support, please contact the Declutta team at [support@declutta.com](mailto:support@declutta.com).

---

> **Note:** This documentation is subject to change. Please refer to the Swagger UI for the most up-to-date API details.