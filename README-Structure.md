##Structure:
```inline
.
├── server
│   ├── config
│   │   ├── main
│   │   ├── database
│   │   │
│   │   ├── key -> SSL
│   │   ├── cert -> SSL
│   │   │
│   │   └── db.json -> Backup DB
│   │
│   ├── controllers
│   │   ├── user
│   │   │
│   │   ├── bookmarks
│   │   │
│   │   ├── dictionary
│   │   │
│   │   ├── chat
│   │   ├── group
│   │   ├── channel
│   │   │
│   │   ├── msg
│   │   │
│   │   ├── auth
│   │   └── verify -> email
│   │
│   ├── models
│   │   ├── user
│   │   │
│   │   ├── chat
│   │   ├── group
│   │   ├── channel
│   │   │
│   │   └── msg
│   │
│   ├── package.json
│   ├── router.js -> contains API routes
│   └── server.js -> the Server initializer
│
├── initial.bash
└── README.md
```
