##Examples of output data for API:
***
###Common
####POST -> `/signin + body:{ email: email, password: password }`
```json
{
    "success": true,
    "id": "59d01301cc19294bed69a1ca",
    "token": "JWT ..."
}
```

***
###User
####GET -> `/my` *or* `/user/:userName` -> *get user profile*
```json
{
    "lastName": "Durov",
    "avatar": {
        "id": "",
        "url": ""
    },
    "bio": "",
    "status": "2017-09-30T21:56:17.045Z",
    "location": {
        "country": "",
        "state": "",
        "city": "",
        "timeZone": ""
    },
    "firstName": "Pashka",
    "userName": "durov"
}
```
####GET -> `/invites` *or* `/contacts` -> *get array of users profile (json with array of objects) (+ for `/contacts` personal chat id)*
```json
[
    {
        "userName": "test",
        "firstName": "Test",
        "lastName": "",
        "bio": "",
        "avatar": {
            "id": "",
            "url": ""
        },
        "status": "2017-09-30T21:56:41.342Z",
        "location": {
            "country": "",
            "state": "",
            "city": "",
            "timeZone": ""
        },
        "chat": "59d6993d89534a64b8b1dc18"
    },
    {
        "userName": "admin",
        "firstName": "Admin",
        "lastName": "",
        "bio": "",
        "avatar": {
            "id": "",
            "url": ""
        },
        "status": "2017-10-01T22:28:57.941Z",
        "location": {
            "country": "",
            "state": "",
            "city": "",
            "timeZone": ""
        },
        "chat": "59d699a289534a64b8b1dc1d"
    }
]
```
####GET -> `/bookmarks` -> *get all msgs (array of objects)*
```json
[
    {
        "_id": "59d7e5f271b1964d1b2284e7",
        "sender": "59d01301cc19294bed69a1ca",
        "__v": 0,
        "date": "2017-10-06T20:22:10.335Z",
        "body": {
            "content": "hello",
            "type": "text"
        }
    },
    {
        "_id": "59d7e5f371b1964d1b2284e8",
        "sender": "59d01301cc19294bed69a1ca",
        "__v": 0,
        "date": "2017-10-06T20:22:11.360Z",
        "body": {
            "content": "hello",
            "type": "text"
        }
    }
]
```

***
###Chat
####GET -> `/chats`  ->  *get array of chats profiles (json with array of objects)*
```json
[
    {
        "_id": "59d7e58a71b1964d1b2284e3",
        "isGroup": false,
        "profile": {
            "name": "Admin ",
            "avatar": {
                "id": "",
                "url": ""
            }
        },
        "sender": "59d01301cc19294bed69a1ca",
        "members": 2,
        "lastMessage": {
            "_id": "59d7e5f371b1964d1b2284e8",
            "sender": "Pashka",
            "__v": 0,
            "date": "2017-10-06T20:22:11.360Z",
            "body": {
                "content": "hello",
                "type": "text"
            }
        },
        "unread": 0,
        "mute": false
    },
    {
        "_id": "59d7e4d971b1964d1b2284d8",
        "isGroup": false,
        "profile": {
            "name": "Test ",
            "avatar": {
                "id": "",
                "url": ""
            }
        },
        "sender": "59d01301cc19294bed69a1ca",
        "members": 2,
        "lastMessage": {
            "_id": "59d7e54471b1964d1b2284df",
            "sender": "Admin",
            "__v": 0,
            "date": "2017-10-06T20:19:16.058Z",
            "body": {
                "content": "hello",
                "type": "text"
            }
        },
        "unread": 0,
        "mute": false
    },
    {
        "_id": "59d7e4fe71b1964d1b2284dd",
        "isGroup": true,
        "profile": {
            "name": "Pashka, Test",
            "avatar": {
                "id": "",
                "url": ""
            }
        },
        "sender": "59d01301cc19294bed69a1ca",
        "members": 2,
        "lastMessage": {
            "_id": "59d7e56171b1964d1b2284e1",
            "sender": "Pashka",
            "__v": 0,
            "date": "2017-10-06T20:19:45.103Z",
            "body": {
                "content": "hello",
                "type": "text"
            }
        },
        "unread": 1,
        "mute": false
    },
    {
        "_id": "59d7e4fe71b1964d1b2284de",
        "isGroup": true,
        "profile": {
            "name": "Pashka, Admin",
            "avatar": {
                "id": "",
                "url": ""
            }
        },
        "sender": "59d01301cc19294bed69a1ca",
        "members": 2,
        "lastMessage": null,
        "unread": 0,
        "mute": true
    }
]
```
####GET -> `/chat/:chatId` -> *get full chat information with 20 latest msgs*
```json
{
    "_id": "59d7e58a71b1964d1b2284e3",
    "isGroup": false,
    "profile": {
        "name": "Admin ",
        "avatar": {
            "id": "",
            "url": ""
        }
    },
    "sender": "59d01301cc19294bed69a1ca",
    "members": [
        {
            "lastName": "Durov",
            "avatar": {
                "id": "",
                "url": ""
            },
            "bio": "",
            "status": "2017-09-30T21:56:17.045Z",
            "location": {
                "country": "",
                "state": "",
                "city": "",
                "timeZone": ""
            },
            "firstName": "Pashka",
            "userName": "durov"
        },
        {
            "lastName": "",
            "avatar": {
                "id": "",
                "url": ""
            },
            "bio": "",
            "status": "2017-10-01T22:28:57.941Z",
            "location": {
                "country": "",
                "state": "",
                "city": "",
                "timeZone": ""
            },
            "firstName": "Admin",
            "userName": "admin"
        }
    ],
    "unread": 0,
    "mute": false,
    "messages": [
        {
            "_id": "59d7e5f371b1964d1b2284e8",
            "sender": "59d01301cc19294bed69a1ca",
            "__v": 0,
            "date": "2017-10-06T20:22:11.360Z",
            "body": {
                "content": "hello",
                "type": "text"
            }
        },
        {
            "_id": "59d7e5f271b1964d1b2284e7",
            "sender": "59d01301cc19294bed69a1ca",
            "__v": 0,
            "date": "2017-10-06T20:22:10.335Z",
            "body": {
                "content": "hello",
                "type": "text"
            }
        }
    ]
}
```