class LoginRouter {
  router (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500
      }
    }
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login Router', () => {
  test('should return 400 if no email is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: '',
        password: 'any_passowrd'
      }
    }
    const httpResponse = sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  test('should return 400 if no password is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: ''
      }
    }
    const httpResponse = sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  test('should return 500 if no httpRequest is provided', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.router()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if no httpRequest no body', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.router({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
