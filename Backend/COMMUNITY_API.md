# Community API Documentation

This document describes the community features API endpoints that have been added to the Lernflow backend.

## Overview

The community API provides functionality for:
- Creating and managing posts (280 character limit)
- Liking/unliking posts
- Extracting and managing hashtags
- Getting trending hashtags based on recent usage

## Authentication

The API uses Clerk for authentication. Protected endpoints require a valid Clerk session token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

## Database Models

### User Model
- `clerkId`: Unique identifier linking to Clerk user
- `username`: Display name (required)
- `avatarUrl`: Profile picture URL
- `email`: User's email address
- `domain`: Optional domain field

### Post Model
- `content`: Post text (max 280 characters)
- `author`: Reference to User model
- `likes`: Array of User references who liked the post
- `hashtags`: Array of Hashtag references
- `createdAt`: Timestamp

### Hashtag Model
- `name`: Unique hashtag name (lowercase, alphanumeric + underscore)

## API Endpoints

### Posts

#### Create Post
**POST** `/api/posts`

Creates a new post. Automatically extracts hashtags from content and creates/links them.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Just learned about #react hooks! #coding #javascript"
}
```

Retrieve raw ingest documents stored in the system. These are created via the ingest API and contain an arbitrary JSON `payload` plus optional `source` metadata.

#### Get Ingest Document
**GET** `/api/ingest/:id`

Returns the ingest document with the given id. The route is implemented in `Backend/src/routes/ingest.routes.js` and returns 404 when the id is not found.

Known example IDs (for documentation/testing):
- `68eba78a0230358d109af052` — motia
- `68ec32c2b60279350227a49e` — polar

Example (curl):

```bash
curl -i -X GET "http://localhost:4000/api/ingest/68eba78a0230358d109af052"
```

Successful response (200):

```json
{
  "_id": "68eba78a0230358d109af052",
  "source": "motia",
  "payload": { /* arbitrary JSON stored at ingest time */ },
  "createdAt": "2025-10-13T12:00:00.000Z"
}
```

Not found response (404):

```json
{ "error": "Not found" }
```

JavaScript (fetch) example:

```javascript
const getIngest = async (id) => {
  const res = await fetch(`/api/ingest/${id}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

// usage
getIngest('68ec32c2b60279350227a49e')
  .then(doc => console.log('ingest doc', doc))
  .catch(err => console.error('failed', err));
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "content": "Just learned about #react hooks! #coding #javascript",
    "author": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "username": "john_doe",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "likes": [],
    "hashtags": [
      { "_id": "64f8a1b2c3d4e5f6a7b8c9d2", "name": "react" },
      { "_id": "64f8a1b2c3d4e5f6a7b8c9d3", "name": "coding" },
      { "_id": "64f8a1b2c3d4e5f6a7b8c9d4", "name": "javascript" }
    ],
    "likeCount": 0,
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

#### Get Posts
**GET** `/api/posts`

Retrieves a paginated list of posts, ordered by creation date (newest first).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10, max: 50)

**Example:** `GET /api/posts?page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "content": "Just learned about #react hooks! #coding #javascript",
        "author": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "username": "john_doe",
          "avatarUrl": "https://example.com/avatar.jpg"
        },
        "likes": ["64f8a1b2c3d4e5f6a7b8c9d5"],
        "hashtags": [
          { "_id": "64f8a1b2c3d4e5f6a7b8c9d2", "name": "react" },
          { "_id": "64f8a1b2c3d4e5f6a7b8c9d3", "name": "coding" },
          { "_id": "64f8a1b2c3d4e5f6a7b8c9d4", "name": "javascript" }
        ],
        "likeCount": 1,
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 50,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

#### Toggle Like
**POST** `/api/posts/:id/like`

Toggles a like on a specific post for the authenticated user.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post liked",
  "data": {
    "post": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "content": "Just learned about #react hooks! #coding #javascript",
      "author": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "username": "john_doe",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "likes": ["64f8a1b2c3d4e5f6a7b8c9d5"],
      "hashtags": [
        { "_id": "64f8a1b2c3d4e5f6a7b8c9d2", "name": "react" },
        { "_id": "64f8a1b2c3d4e5f6a7b8c9d3", "name": "coding" },
        { "_id": "64f8a1b2c3d4e5f6a7b8c9d4", "name": "javascript" }
      ],
      "likeCount": 1,
      "createdAt": "2023-09-06T10:30:00.000Z"
    },
    "liked": true,
    "likeCount": 1
  }
}
```

### Trending Topics

#### Get Trending Hashtags
**GET** `/api/trending`

Returns the top 10 trending hashtags based on usage in posts created in the last 48 hours.

**Response:**
```json
{
  "success": true,
  "message": "Trending hashtags retrieved successfully",
  "data": {
    "trendingHashtags": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "react",
        "count": 25,
        "latestPost": "2023-09-06T10:30:00.000Z"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "name": "coding",
        "count": 18,
        "latestPost": "2023-09-06T09:15:00.000Z"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "name": "javascript",
        "count": 12,
        "latestPost": "2023-09-06T08:45:00.000Z"
      }
    ],
    "timeRange": "48 hours",
    "generatedAt": "2023-09-06T11:00:00.000Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found (post not found)
- `500`: Internal Server Error

## Environment Variables

Ensure these environment variables are set:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Installation

1. Install the new dependency:
```bash
npm install @clerk/clerk-sdk-node
```

2. The API routes are automatically registered when the server starts.

## Usage Examples

### Frontend Integration (JavaScript/TypeScript)

```javascript
// Create a post
const createPost = async (content, sessionToken) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ content })
  });
  return response.json();
};

// Get posts with pagination
const getPosts = async (page = 1, limit = 10) => {
  const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
  return response.json();
};

// Toggle like on a post
const toggleLike = async (postId, sessionToken) => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  return response.json();
};

// Get trending hashtags
const getTrending = async () => {
  const response = await fetch('/api/trending');
  return response.json();
};
```

## Features

- **Automatic Hashtag Extraction**: Hashtags are automatically extracted from post content and stored as separate entities
- **Efficient Like System**: Uses MongoDB's `$addToSet` and `$pull` operators for efficient like/unlike operations
- **Trending Algorithm**: Calculates trending hashtags based on usage in the last 48 hours using MongoDB aggregation
- **Pagination**: Built-in pagination for post listings
- **User Sync**: Automatic user creation and synchronization with Clerk
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Consistent error responses across all endpoints
