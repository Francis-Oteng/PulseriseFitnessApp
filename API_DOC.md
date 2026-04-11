# Pulserise Backend API Documentation

## Overview

The Pulserise Backend is a Spring Boot REST API that provides fitness and wellness services including user authentication, AI-powered chat functionality, and personalized workout recommendations. The API uses JWT-based authentication and integrates with Groq AI for intelligent responses.

**Base URL:** `https://pulserisebackend-production.up.railway.app`  
**API Version:** 1.0  
**Authentication:** JWT Bearer Token  

## Table of Contents

1. [Authentication](#authentication)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Chat Endpoints](#chat-endpoints)
4. [Recommendation Endpoints](#recommendation-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Security](#security)

---

## Authentication

The API uses JWT (JSON Web Token) based authentication. After successful login, you'll receive an access token that must be included in the `Authorization` header for protected endpoints.

### Authorization Header Format
```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
- **Access Token:** 24 hours (86400000 ms)
- **Refresh Token:** 7 days (604800000 ms)

---

## Authentication Endpoints

### POST /api/auth/signin
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, must be a valid email format
- `password`: Required, not blank

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "profileCompleted": true,
  "roles": ["ROLE_USER"]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid credentials",
  "message": "Authentication failed"
}
```

---

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `username`: Required, 3-20 characters
- `email`: Required, valid email format, max 50 characters
- `password`: Required, 6-40 characters

**Success Response (200 OK):**
```json
{
  "message": "User registered successfully!"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "User already exists",
  "message": "Email is already in use!"
}
```

---

### GET /api/auth/test
Test public endpoint (no authentication required).

**Success Response (200 OK):**
```json
{
  "message": "Public endpoint is working!",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### GET /api/auth/protected
Test protected endpoint (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200 OK):**
```json
{
  "message": "Protected endpoint is working!",
  "user": "user@example.com",
  "authorities": [
    {
      "authority": "ROLE_USER"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Chat Endpoints

### POST /api/chat/message
Send a message to the AI chat service.

**Authentication:** Required (USER or ADMIN role)

**Request Body:**
```json
{
  "message": "What's the best workout for building muscle?",
  "context": "beginner fitness level"
}
```

**Validation Rules:**
- `message`: Required, not blank, max 2000 characters
- `context`: Optional

**Success Response (200 OK):**
```json
{
  "response": "For building muscle as a beginner, I recommend starting with compound exercises...",
  "model": "llama3-8b-8192",
  "timestamp": "2024-01-15T10:30:00Z",
  "success": true,
  "error": null
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "response": null,
  "model": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "success": false,
  "error": "AI chat service is currently unavailable"
}
```

---

### GET /api/chat/status
Check the availability status of the chat service.

**Authentication:** Required (USER or ADMIN role)

**Success Response (200 OK):**
```json
{
  "available": true,
  "message": "Chat service is available"
}
```

**Error Response (200 OK):**
```json
{
  "available": false,
  "message": "Chat service is not configured"
}
```

---

## Recommendation Endpoints

### POST /api/recommendations/generate
Generate personalized fitness recommendations based on user profile and preferences.

**Authentication:** Required (USER or ADMIN role)

**Request Body:**
```json
{
  "userId": 1,
  "category": "fitness",
  "preferences": ["strength training", "muscle building"],
  "context": "Looking to build upper body strength",
  "limit": 5,
  "fitnessLevel": "intermediate",
  "fitnessGoals": ["muscle gain", "strength"],
  "weight": 75.5,
  "height": 180.0,
  "age": 28,
  "bmi": 23.3,
  "activityLevel": "moderately active",
  "availableEquipment": ["gym", "dumbbells", "barbell"],
  "workoutDaysPerWeek": 4,
  "workoutDurationMinutes": 60,
  "injuries": [],
  "preferredWorkoutTypes": ["strength", "powerlifting"]
}
```

**Validation Rules:**
- `userId`: Required, not null
- `weight`: Optional, 30-300 kg if provided
- `height`: Optional, 100-250 cm if provided
- `age`: Optional, 13-120 years if provided

**Success Response (200 OK):**
```json
{
  "recommendations": [
    {
      "title": "Upper Body Strength Program",
      "description": "A comprehensive 4-week program focusing on building upper body strength",
      "type": "workout",
      "confidence": 0.95,
      "reason": "Based on your intermediate fitness level and strength goals",
      "duration": "4 weeks",
      "difficulty": "intermediate",
      "targetMuscles": ["chest", "shoulders", "back", "arms"],
      "equipment": ["barbell", "dumbbells", "bench"],
      "estimatedCaloriesBurn": 400,
      "workoutPlan": {
        "planName": "Upper Body Strength Builder",
        "planDescription": "Progressive overload program for upper body development",
        "totalWeeks": 4,
        "workoutsPerWeek": 3,
        "workoutDays": [
          {
            "dayName": "Day 1: Chest & Triceps",
            "focus": "Upper Body Push",
            "estimatedDuration": 60,
            "exercises": [
              {
                "name": "Bench Press",
                "description": "Compound chest exercise",
                "sets": "4",
                "reps": "8-10",
                "weight": "moderate to heavy",
                "restTime": "90 seconds",
                "targetMuscles": ["chest", "triceps", "shoulders"],
                "difficulty": "intermediate",
                "instructions": "Lie on bench, grip bar slightly wider than shoulders..."
              }
            ]
          }
        ]
      }
    }
  ],
  "category": "fitness",
  "timestamp": "2024-01-15T10:30:00Z",
  "success": true,
  "error": null
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "recommendations": null,
  "category": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "success": false,
  "error": "AI recommendation service is currently unavailable"
}
```

---

### GET /api/recommendations/categories
Get available recommendation categories.

**Authentication:** Required (USER or ADMIN role)

**Success Response (200 OK):**
```json
{
  "categories": [
    "fitness",
    "nutrition",
    "supplementation",
    "performance",
    "bodybuilding",
    "powerlifting",
    "endurance",
    "weight-loss",
    "muscle-gain",
    "recovery",
    "wellness",
    "mental-health",
    "sleep",
    "hydration",
    "lifestyle",
    "advanced-training",
    "competition-prep",
    "injury-prevention",
    "rehabilitation",
    "biohacking",
    "longevity",
    "general"
  ]
}
```

---

### GET /api/recommendations/status
Check the availability status of the recommendation service.

**Authentication:** Required (USER or ADMIN role)

**Success Response (200 OK):**
```json
{
  "available": true,
  "message": "Recommendation service is available"
}
```

---

## Data Models

### User
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "profileCompleted": true,
  "roles": ["ROLE_USER"]
}
```

### JWT Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "profileCompleted": true,
  "roles": ["ROLE_USER"]
}
```

### Chat Request
```json
{
  "message": "What's the best workout routine?",
  "context": "beginner level"
}
```

### Chat Response
```json
{
  "response": "AI generated response...",
  "model": "llama3-8b-8192",
  "timestamp": "2024-01-15T10:30:00Z",
  "success": true,
  "error": null
}
```

### Recommendation Request
```json
{
  "userId": 1,
  "category": "fitness",
  "preferences": ["strength training"],
  "context": "Building muscle",
  "limit": 5,
  "fitnessLevel": "intermediate",
  "fitnessGoals": ["muscle gain"],
  "weight": 75.5,
  "height": 180.0,
  "age": 28,
  "activityLevel": "moderately active",
  "availableEquipment": ["gym"],
  "workoutDaysPerWeek": 4,
  "workoutDurationMinutes": 60,
  "injuries": [],
  "preferredWorkoutTypes": ["strength"]
}
```

### Exercise
```json
{
  "name": "Bench Press",
  "description": "Compound chest exercise",
  "sets": "4",
  "reps": "8-10",
  "weight": "moderate",
  "restTime": "90 seconds",
  "targetMuscles": ["chest", "triceps"],
  "difficulty": "intermediate",
  "instructions": "Detailed exercise instructions...",
  "videoUrl": "https://example.com/video",
  "imageUrl": "https://example.com/image"
}
```

### Workout Plan
```json
{
  "planName": "Upper Body Strength",
  "planDescription": "4-week strength building program",
  "totalWeeks": 4,
  "workoutsPerWeek": 3,
  "workoutDays": [
    {
      "dayName": "Day 1: Chest & Triceps",
      "focus": "Upper Body Push",
      "estimatedDuration": 60,
      "exercises": []
    }
  ]
}
```

### Nutrition Plan
```json
{
  "planName": "Muscle Building Diet",
  "description": "High protein diet for muscle growth",
  "dailyCalories": 2500,
  "macros": {
    "protein": 150,
    "carbs": 250,
    "fats": 80
  },
  "meals": [
    {
      "mealName": "Breakfast",
      "description": "High protein breakfast",
      "calories": 500,
      "foods": ["eggs", "oatmeal", "banana"]
    }
  ],
  "supplements": ["whey protein", "creatine"]
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - External service unavailable |

### Common Error Types

- **Validation Errors**: Invalid input data
- **Authentication Errors**: Invalid credentials or expired tokens
- **Authorization Errors**: Insufficient permissions
- **Service Unavailable**: External AI services not available
- **User Already Exists**: Duplicate user registration

---

## Security

### CORS Configuration
The API supports Cross-Origin Resource Sharing (CORS) with the following settings:
- **Allowed Origins**: `http://localhost:3000`, `http://localhost:19006`, `exp://192.168.1.100:19000`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Allowed Headers**: All headers (`*`)
- **Credentials**: Supported

### JWT Security
- **Algorithm**: HS256
- **Secret Key**: Configurable via environment variable
- **Token Expiration**: 24 hours
- **Refresh Token**: 7 days

### Password Security
- **Encoding**: BCrypt with strength 10
- **Minimum Length**: 6 characters
- **Maximum Length**: 40 characters

### Protected Endpoints
All endpoints except `/api/auth/**` and `/api/test/**` require authentication.

### Rate Limiting
Currently not implemented but recommended for production use.

---

## Environment Configuration

### Required Environment Variables
- `JWT_SECRET`: Secret key for JWT token signing
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `GROQ_API_KEY`: API key for Groq AI service

### Optional Environment Variables
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `MAIL_HOST`: SMTP server host
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password

---

## Development Notes

### Database
- **Type**: PostgreSQL
- **Connection Pool**: HikariCP
- **ORM**: Hibernate/JPA
- **Migration**: Automatic schema updates in development

### AI Integration
- **Provider**: Groq AI
- **Model**: llama3-8b-8192
- **Timeout**: 30 seconds (60 seconds in development)
- **Max Tokens**: 1000
- **Temperature**: 0.7 (0.8 in development)

### Logging
- **Level**: DEBUG in development
- **SQL Logging**: Enabled in development
- **Security Logging**: Enabled in development

---

## API Testing

### Using cURL

**Login Example:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Chat Example:**
```bash
curl -X POST http://localhost:8080/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"What is the best workout for beginners?"}'
```

**Recommendations Example:**
```bash
curl -X POST http://localhost:8080/api/recommendations/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId":1,"category":"fitness","fitnessLevel":"beginner"}'
```

---

## Support

For API support and questions, please contact the development team or refer to the project documentation.

**Last Updated:** January 2024  
**API Version:** 1.0