# MEAN Stack Task Manager Application (Angular 1.3, Node WebKit, Express, Socket, MongoDB)

## Overview

This is a client server application with below components:

Client side:
  - [Angular 1.3](http://devdocs.io/angularjs~1.3/)
  - [Node WebKit](https://github.com/nwjs/nw.js/) (Build desktop applications)
  - [Socket](https://socket.io/) (Event messaging)
  - [LDAP](http://ldapjs.org/) (User authentication)
  - [nw-notify](https://github.com/cgrossde/nw-notify) (Desktop Notification)

Server side:
  - [Express](https://expressjs.com/) (Node.js web framework)
  - [Socket](https://socket.io/) (Event messaging)
  - [JWT](https://jwt.io/) (Token authentication)
  - [Mongoose ODM](http://mongoosejs.com/)


![EASYTM](https://i.imgur.com/uS3Dnui.gif)

## Prerequisites

  - Node.js - [Download & Install NodeJS](https://nodejs.org/en/download/) and the npm package manager
  - MongoDB - [Download & Install MongoDB](https://www.mongodb.com/download-center#community) and make sure it's running on the default port 27017.
  - RoboMongo (Optional) - [Download & Install RoboMongo](https://robomongo.org/) lightweight GUI for MongoDB. Create a new connection to the MongoDB server running at default port.

## Installing server dependencies

To install the server dependencies, navigate to the module 'easytm-server' and run below command from command-line:

```
npm install
```

This will install all the required dependencies for running the server.

## Running your server

To start the server run below command from command-line:

```
npm start
```

Once the server has started successfully you should be seeing the message 'server started' on your command-line.

REST API's exposed by the server and their usage are documented in the README file available in the module 'easytm-server'

## Running client application

To run the client application follow below steps:

1.  Install nw from npm
    ```
    npm install -g nw
    ```
2. To install the app dependencies, navigate to the module 'easytm-app' and run below command from command-line:

   ```
   npm install
   ```
3. Change to the app directory 'easytm-app' and run below command:
    ```
    nw .
    ```

## [Package & Distribution](https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps)

We will be using nwbuilder for packaging our app

1. Install nw-builder from npm
   ```
   npm install -g nw-builder
   ```
2. Package your app with below command [nw-builder reference](https://github.com/nwjs-community/nw-builder):
   ```
   nwbuild -p <platform> <path_to_app>

   e.g. nwbuild -p win32 easytm-app/
   ```
   
3. Navigate to the build folder and run the app 'easytm-app.exe'