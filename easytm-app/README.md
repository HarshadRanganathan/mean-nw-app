# Angular-NodeWebKit Application

## Overview

This is a client application which communicates with express server and MongoDB as backend database.

This application allows users to login using LDAP authentication and perform below functions:
 - Task Creation
 - Group Creation
 - Add users to group
 - Assign tasks to users within group
 - View tasks progress of each individual user in the group
 - Group deletion


## LDAP Authentication

We have currently disabled LDAP authentication in the application. So, users can directly login with dummy ID and password with no authentication happening in the background.

To enable LDAP authentication update the required configuration details in the file [loginController.js](app/components/login/loginController.js)

## App options

You can modify how the app behaves by updating the [manifest](package.json) file.

[Manifest reference](https://github.com/nwjs/nw.js/wiki/manifest-format)

## Debugging

We can debug the app in couple of ways:

1. Set the 'toolbar' option to 'true' in the [manifest](package.json) file.

    You can then use Chrome inspect options to check the console logs for any issues.
2. Enable chromium logging by adding below argument to the manifest file
    ```
    "chromium-args": "--enable-logging=stderr"
    ```