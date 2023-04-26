# Art Portal Backend Server (RESTful API)

## Pages:
* (/, main.html)
* (/login, login.html)
* (/register, register.html)

## API:
### AUTH API:
* (POST, /auth/register):
  * Body: ({login: string, password: string, name: string, image: file})
  * Response: ({message: string})
* (POST, /auth/login):
  * Body: ({login: string, password: string})
  * Response: ({jwt: token})

### Posts API:
* (GET, /posts):
  * Response: ({posts: [Post]})
* (GET, /posts/top):
  * Response: ({posts: [Post]})
* (POST, /posts/create, TOKEN REQUIRED):
  * Body: ({title: string, image: imageData, categoryId: categoryId, technique: string, style: string, genre: string})
  * Response: ({post: Post})
* (PUT, /posts/update/:id, TOKEN REQUIRED):
  * Body: ({title: string, image: imageData, categoryId: categoryId, techniqueId: string, style: string, genre: string})
  * Response: ({post: Post})
* (DELETE, /posts/delete/:id, TOKEN REQURED): 
  * Response: ({posts: [Post]})

### Categories API:
* (GET, /categories):
  * Response: ({categories: [Category]})

### Authors API:
* (GET, /authors):
  * Response: ({authors: [Author]})

### Chats API:
* (GET, /chats, TOKEN REQUIRED):
  * Response: ({chats: [Chat]})
* (GET, /chats/:id, TOKEN REQUIRED):
  * Response: ({messages: [Message]})
* (POST, /chats/add:reciever, TOKEN REQURED)
  * Response: (chat: Chat)
  * Body: (message: string)
* (POST, /chats/:id/add-message, TOKEN REQURED)
  * Response: (message: Message)
  * Body: (message: string)
* (PUT, /chats/:id/update-message/:message-id, TOKEN REQURED)
  * Response: (message: Message)
  * Body: (newMessage: string)
* (DELETE, /chats/delete/:id, TOKEN REQURED)
  * Response: ({chats: [Chat]})

### Archive API:
* (GET, /archive, TOKEN REQUIRED):
  * Response: ({posts: [Post]})
* (POST, /archive/add/:id, TOKEN REQUIRED):
  * Response: ({post: Post})
* (DELETE, /archive/delete/:id, TOKEN REQUIRED):
  * Response: ({posts: [Post]})

### Statistics API:
* (GET, /statistics, TOKEN REQUIRED):
  * Response: ({posts: [{post: Post, inTop: bool}]})

### Friends API:
* (GET, /friends, TOKEN REQUIRED):
  * Response: ({friends: [User]})
* (GET, /friends/requrests, TOKEN REQUIRED):
  * Response: ({requests: [FriendRequest]})
* (POST, /friends/add/:id, TOKEN REQUIRED):
  * Response: ({friend: User})
* (DELETE, /friends/delete/:id, TOKEN REQUIRED):
  * Response: ({freinds: [User]})

### Search API:
* (POST, /search):
  * Response: ({posts: [Post]})
