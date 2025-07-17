# Freely Homework API

A serverless API built with AWS Lambda, DynamoDB, SNS, and SQS for user management and message handling.

## Architecture

- **API Gateway**: HTTP endpoints for REST API
- **Lambda Functions**: Serverless compute for business logic
- **DynamoDB**: NoSQL database for users and messages
- **SNS**: Asynchronous user registration notifications
- **SQS**: Message queue for asynchronous message creation

## Installation

1. Clone the repository then:
```bash
cd freely-homework
```

2. Install dependencies:
```bash
npm install
```

3. Deploy to AWS:
```bash
npm run deploy
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/register` | Register a new user |
| GET | `/user/email/{email}` | Get user by email |
| DELETE | `/user/{id}` | Delete user by ID |
| POST | `/message/create` | Create message (queued) |
| GET | `/message/list` | List all messages |
| DELETE | `/message/delete/{id}` | Delete message by ID |
| POST | `/message/post` | Post message directly |

## Testing with Postman

### Import the Collection

1. Download the `freely-homework.postman_collection.json` file
2. Open Postman
3. Click "Import" and select the JSON file
4. The collection will be imported with all endpoints pre-configured