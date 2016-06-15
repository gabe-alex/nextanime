class Auth {
  *handle (request, response, next) {
    if(!auth) {
      response.status(401).send("Login first")
      return
    }
    yield next
  }
}
