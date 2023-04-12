# Art Portal Backend Server (RESTful API)

# API services:

## AUTH Service:
* (POST, /auth/register):
  * Body: {login: string, password: string, name: string}
  * Response: (http satus (created, confilct), message: string)
* (POST, /auth/login):
  * Body: { login: string, password: string }
  * Response: (http satus (authorized, unauthorized), user: User, jwt)

## Posts Service:
* (GET, /posts):
  * Response: ({posts: [Post]} )
* (GET, /posts/top100):
  * Response: ({posts: [Post]} )
* (POST, /posts/create, TOKEN REQUIRED):
  * Body: { owner: userId, title: string, image: imageData, categoryId: categoryId, techniqueId: techniqueId, styleId: styleId, genreId: genreId }
  * Response: (http status (created, conflict), post: Post )
* (PUT, /posts/update/:id, TOKEN REQUIRED):
  * Body: { postId: postId, title: string, image: imageData, categoryId: categoryId, techniqueId: techniqueId, styleId: styleId, genreId: genreId }
  * Response: (http status (updated, conflict), post: Post)
* (DELETE, /posts/delete/:id, TOKEN REQURED): 
  * Response: (http status (ok, conflict))

