# Express & Mongoose REST API server

## Features

| Feature       | Summary           |
| ------        | ------            |
|Authentication via JsonWebToken|Supports authentication using [jsonwebtoken](https://jwt.io/)|
|MongoDB object modeling via Mongoose|Supports schema based validation, validation, query building, business logic using [mongoose](http://mongoosejs.com/) |
|Event based communication via Socket|Supports real-time bidirectional event-based communication using [socket](https://socket.io/) |

## Additional Details

Server runs on default port 5000

MongoDB connection url is defined in the [config](config/config.js) file

Download the [postman collection](EasyTM.postman_collection.json) with all the API requests

## REST API's


| API           | Type  |   Description |Endpoint    |
| ------        | ------|   ------      |------      |
|Authentication |POST   |JWT authentication token   |http://localhost:5000/rest/authentication |
|Add New User   |POST   |Add new user by providing userId, name and email   |http://localhost:5000/user/new    |
|Get User Details   |GET    |Returns user information and associated tasks  |http://localhost:5000/user/:userId    |
|Check If User Exists   |GET    |Boolean asserting if supplied userId exists or not    |http://localhost:5000/user/search/:userId |
|List All Users |GET    |List all user emails and object id's    |http://localhost:5000/user/search |
|Add New Task   |POST   |Add a new task to the user. Expected fields: userId, userName, assigneeId, taskName, description, status   | http://localhost:5000/task/new    |
|List All Tasks |GET    |Lists all tasks with details   |http://localhost:5000/task/all |
|Update Task State|POST |Change the tasks state to CURRENT, HOLD or COMPLETE   |http://localhost:5000/task/:taskId/current http://localhost:5000/task/:taskId/hold http://localhost:5000/task/:taskId/complete |
|Add New Group  |POST   |Create a new group and add users. Expected fields: userId, groupName, users (array of user object id's)  |http://localhost:5000/group/new   |
|Delete Group   |POST   |Delete an existing group  |http://localhost:5000/group/:groupId/delete   |
|Get Group Details  |GET  |Get details of a particular group | http://localhost:5000/group/:groupId  |
|List all groups owned by leader    |GET    | Get all groups owned by a person|http://localhost:5000/groups/:leaderId |

## API Usage

1. Generate web token for authentication
    
    Submit a POST request to the endpoint 'localhost:5000/rest/authentication' with below body
    ```
    {
        "userId": "1234"
    }
    ```
    where the userId '1234' is a dummy value.

    Sample response:
    ```
    {
        "success": true,
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0IiwiaWF0IjoxNTA4MDY4MDQ1LCJleHAiOjE1MDgxNTQ0NDV9._ZX2l8eaJvBuuCWSKDL-WSlWyK8ceQi1QyReRxQIj78",
        "expiresIn": "24h"
    }
    ```
2. Submit API requests with Authentication header having the Bearer token generated in Step 1.

    ```
    -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0IiwiaWF0IjoxNTA4MDY4MDQ1LCJleHAiOjE1MDgxNTQ0NDV9._ZX2l8eaJvBuuCWSKDL-WSlWyK8ceQi1QyReRxQIj78'
    ```

    Otherwise we'll get token error
    ```
    {
        "error": "Invalid Token"
    }
    ```

