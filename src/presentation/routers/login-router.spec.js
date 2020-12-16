const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
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
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
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
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
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
