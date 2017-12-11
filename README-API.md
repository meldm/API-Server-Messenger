##API:

```inline
.
└── POST
    ├── /signup + body:{ profile.userName: userName, profile.firstName: firstName, email: email, password: password  }
    ├── /signin + body:{ email: email, password: password }  ->  get token and _id
    │
    ├── /check/userName + body:{ profile.userName: userName }  ->  for signup
    └── /check/email + body:{ email: email }  ->  for signup
```

```inline
User
├── GET
│   ├── /my  ->  get my profile
│   ├── /user/:userName  ->  get user profile by userName
│   │
│   ├── /invites  ->  get array of invites profiles
│   └── /contacts  ->  get array of contacts profiles (json with array of objects)
│
├── POST
│
├── PUT
│   ├── /my + body:{ ... }  ->  update my data
│   ├── /my/check/:userName + body:{ profile.userName: newUserName }  ->  check new userName
│   │
│   ├── /user/check/:userName + body:{ userName: UserName }  ->  check userName and get userId
│   │
│   ├── /invite/:userName  ->  send invite to contact
│   ├── /contact/:userName  ->  add the user to my contacts
│   │
│   ├── /avatar + body:{ image: file }  ->  update my avatar
│   │
│   ├── /status  ->  update status
│   │
│   └── /logout
│
└── DELETE
    ├── /invite/:userName  ->  remove invite to contact
    └── /contact/:userName  ->  remove contact
```

```inline
Bookmarks
├── GET
│   ├── /bookmarks  ->  get all msgs (array of objects)
│   └── /bookmarks/:index  ->  (where :index from 0 to bookmarks.length/20) get top 20 msgs starting with 20*index
│
├── POST
│
├── PUT
│   └── /bookmarks + body:{ msgId[index]: msgId }  ->  add selected msgs to bookmarks
│
└── DELETE
    ├── /bookmarks/history  ->  remove all msgs (and own objects of msgs)
    └── /bookmarks + body:{ msgId[index]: msgId }  ->  remove msgs
```

```inline
Chat
├── GET
│   ├── /chats  ->  get array of chats profiles (json with array of objects)
│   │
│   ├── /chat/:chatId  ->  get full chat information with 20 latest msgs
│   └── /chat/:chatId/:index  ->  (where :index from 0 to chats.length/20) get full chat information with the top 20 msgs starting with 20*index
│
├── POST
│   └── /chat + body:{ userName[index]: userName }  ->  create new group chat and get new chatId
│
├── PUT
│   ├── /chat/:chatId/members + body:{  userName[index]: userName }  ->  add new members in the chat
│   │
│   ├── /chat/:chatId/name + body:{ name: newName }  ->  update avatar of the group chat
│   └── /chat/:chatId/avatar + body:{ image: file }  ->  update avatar in group chat
│
└── DELETE
    ├── /chat/:chatId  ->  leave group chat and remove from my chats
    ├── /chat/:chatId/history  ->  remove all msgs (clear history)
    │
    ├── /chat/:chatId/msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs
    │
    └── /chat/:chatId/members + body:{ userName[index]: userName }  ->  remove members
```

```inline
Group
├── GET
│   └── /groups  ->  get  array of groups profiles (json with array of objects)
│
├── POST
├── PUT
└── DELETE
```

```inline
Channel
├── GET
│   └── /channels  ->  get  array of channels profiles (json with array of objects)
│
├── POST
├── PUT
└── DELETE
```

```inline
Msg
├── GET
│
├── POST
│   └──  /msg/chat/:chatId + body:{ msg: Text }  ->  send new msg and get new msgId
│
├── PUT
│   ├── /msg/:msgId/chat/:chatId  ->  forward single msg
│   │
│   └── /msgs + body:{ msgId[index]: msgId, chatId[index]: chatId | groupId[index]: groupId | channelId[index]: channelId }  ->  forward select (array) msgs
│
└── DELETE
    ├── /msg/:msgId  ->  remove single msg everywhere (if author)
    └── /msgs + body:{ msgId[index]: msgId }  ->  remove select (array) msgs everywhere (if author)
```