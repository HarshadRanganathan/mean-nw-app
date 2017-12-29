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


| API                   | Endpoint    |Method       |   Description |
| ------                | ------      |   ------    |------         |
|Authentication         |http://localhost:5000/rest/authentication      |POST   |JWT authentication token                                       |
|Add New User           |http://localhost:5000/user/new                 |POST   |Add new user by providing userId, name and email               |
|Get User Details       |http://localhost:5000/user/:userId             |GET    |Returns user information and associated tasks                  |
|Check If User Exists   |http://localhost:5000/user/search/:userId      |GET    |Boolean asserting if supplied userId exists or not             |
|List All Users         |http://localhost:5000/user/search              |GET    |List all user emails and object id's                           |
|Add New Task           |http://localhost:5000/task/new                 |POST   |Add a new task to the user. Expected fields: userId, userName, assigneeId, taskName, description, status   | 
|List All Tasks         |http://localhost:5000/task/all                 |GET    |Lists all tasks with details                                   |
|Update Task State      |http://localhost:5000/task/:taskId/current http://localhost:5000/task/:taskId/hold http://localhost:5000/task/:taskId/complete |POST |Change the tasks state to CURRENT, HOLD or COMPLETE   |
|Add New Group          |http://localhost:5000/group/new                |POST   |Create a new group and add users. Expected fields: userId, groupName, users (array of user object id's)  |
|Delete Group           |http://localhost:5000/group/:groupId/delete    |POST   |Delete an existing group                                        |
|Get Group Details      |http://localhost:5000/group/:groupId           |GET    |Get details of a particular group                               |
|List all groups owned by leader|http://localhost:5000/groups/:leaderId |GET    | Get all groups owned by a person                               |

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

