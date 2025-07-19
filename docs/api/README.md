# API Documentation

This document provides comprehensive documentation for all public APIs.

## Base URL

```
https://api.example.com/v1
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/endpoint
```

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per API key
- **Headers**: Rate limit information is provided in response headers:
  - `X-RateLimit-Limit`: Maximum requests per hour
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|---------|-------------|
| `INVALID_REQUEST` | 400 | The request is malformed or missing required parameters |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions for this operation |
| `NOT_FOUND` | 404 | The requested resource does not exist |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Endpoints

### Users API

#### Get User Profile

Retrieves user profile information.

**Endpoint**: `GET /users/{userId}`

**Parameters**:
- `userId` (string, required): The unique identifier for the user

**Response**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-20T14:45:00Z"
}
```

**Example Request**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.example.com/v1/users/user123
```

**Example Response**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-20T14:45:00Z"
}
```

#### Update User Profile

Updates user profile information.

**Endpoint**: `PUT /users/{userId}`

**Parameters**:
- `userId` (string, required): The unique identifier for the user

**Request Body**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Response**:
```json
{
  "id": "user123",
  "name": "Updated Name",
  "email": "updated@example.com",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-21T09:15:00Z"
}
```

**Example Request**:
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Doe", "email": "jane@example.com"}' \
     https://api.example.com/v1/users/user123
```

### Data API

#### Get Data Collection

Retrieves a paginated list of data items.

**Endpoint**: `GET /data`

**Query Parameters**:
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 20, max: 100): Number of items per page
- `sort` (string, optional, default: "created_at"): Field to sort by
- `order` (string, optional, default: "desc"): Sort order ("asc" or "desc")
- `filter` (string, optional): Filter criteria

**Response**:
```json
{
  "data": [
    {
      "id": "item123",
      "title": "Sample Item",
      "description": "This is a sample item",
      "created_at": "2023-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Example Request**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.example.com/v1/data?page=1&limit=10&sort=title&order=asc"
```

#### Create Data Item

Creates a new data item.

**Endpoint**: `POST /data`

**Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "metadata": {
    "key": "value"
  }
}
```

**Response**:
```json
{
  "id": "item456",
  "title": "New Item",
  "description": "This is a new item",
  "metadata": {
    "key": "value"
  },
  "created_at": "2023-01-21T15:30:00Z",
  "updated_at": "2023-01-21T15:30:00Z"
}
```

**Example Request**:
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "My New Item", "description": "A sample description"}' \
     https://api.example.com/v1/data
```

## SDKs and Libraries

### JavaScript/Node.js

```javascript
const ApiClient = require('api-client');

const client = new ApiClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.example.com/v1'
});

// Get user profile
const user = await client.users.get('user123');

// Create data item
const newItem = await client.data.create({
  title: 'My Item',
  description: 'Item description'
});
```

### Python

```python
from api_client import ApiClient

client = ApiClient(
    api_key='YOUR_API_KEY',
    base_url='https://api.example.com/v1'
)

# Get user profile
user = client.users.get('user123')

# Create data item
new_item = client.data.create({
    'title': 'My Item',
    'description': 'Item description'
})
```

## Webhooks

### Event Types

- `user.created` - Triggered when a new user is created
- `user.updated` - Triggered when a user profile is updated
- `data.created` - Triggered when a new data item is created
- `data.updated` - Triggered when a data item is updated
- `data.deleted` - Triggered when a data item is deleted

### Webhook Payload

```json
{
  "event": "user.created",
  "timestamp": "2023-01-21T15:30:00Z",
  "data": {
    "id": "user456",
    "name": "New User",
    "email": "newuser@example.com"
  }
}
```

### Setting up Webhooks

1. Configure webhook URL in your account settings
2. Verify webhook signature using the provided secret
3. Respond with HTTP 200 status code to acknowledge receipt

**Example Verification (Node.js)**:
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## Testing

### Postman Collection

Download our [Postman collection](./postman/api-collection.json) for easy API testing.

### cURL Examples

See the [examples directory](../examples/api/) for comprehensive cURL examples.

## Changelog

### v1.2.0 (2023-01-21)
- Added data filtering capabilities
- Improved error messages
- Added webhook support

### v1.1.0 (2023-01-15)
- Added pagination to data endpoints
- Improved rate limiting headers
- Added user profile update endpoint

### v1.0.0 (2023-01-01)
- Initial API release
- Basic CRUD operations for users and data
- Authentication and rate limiting