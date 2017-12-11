##Models:

```inline
User
├── profile
│   ├── userName -> individual
│   ├── firstName
│   ├── lastName
│   ├── bio
│   ├── status
│   │
│   ├── avatar
│   │   ├── low
│   │   │   ├── id
│   │   │   └── url
│   │   └── high
│   │       ├── id
│   │       └── url
│   │
│   └── location
│       ├── country
│       ├── state
│       ├── city
│       └── timeZone
│
├── _id
├── email
├── _password
├── accessTokens -> [token] ≈ [device]
│
├── bookmarks -> [msgId]
│
├── invites -> [userId]
│
├── contacts -> [{...}]
│   ├── userId
│   └── chatReceiverId
│
├── chats -> [chatReceiverId]
├── groups -> [group-followerId]
└── channels -> [channel-followerId]
```

```inline
Chat-main
├── group
│   ├── isGroup
│   │
│   ├── messages
│   │
│   └── profile
│       ├── name
│       └── avatar
│           ├── id
│           └── url
│
├── members -> [userId]
└── _id

Chat-receivers
├── _id
├── chatMain -> chatMainId
│
├── personal
│   ├── isPersonal
│   │
│   ├── receiver
│   │
│   └── profile
│       ├── name
│       └── avatar
│           ├── id
│           └── url
│
├── sender
│
├── unread -> counter
├── mute -> bool
│
└── messages -> [msgId]
```

```inline
Group-main
├── profile
│   ├── groupName -> individual
│   ├── title
│   ├── description
│   │
│   ├── admins -> [userId]
│   ├── followers -> [userId]
│   │
│   └── avatar
│       ├── id
│       └── url
│
├── _id
├── members
└── messages -> [msgId]

Group-followers
├── _id
├── groupMain -> groupId
├── unread -> counter
└── mute -> bool
```

```inline
Channel-main
├── profile
│   ├── channelName -> individual
│   ├── title
│   ├── description
│   │
│   ├── admins -> [userId]
│   ├── followers -> [userId]
│   │
│   └── avatar
│       ├── id
│       └── url
│
├── _id
├── members
└── messages -> [msgId]

Channel-followers
├── _id
├── channelMain -> channelId
├── unread -> counter
└── mute -> bool
```

```inline
Msg
├── body
│   ├── type -> [text, image, music, video, ref, file, location, contact, forwardMsg, audioMsg, videoMsg]
│   └── content
│
├── _id
├── sender
└── date
```
