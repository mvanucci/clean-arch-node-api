const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizeError = require('../helpers/unauthorize-error')
const ServerError = require('../helpers/server-error')
const InvalidParamError = require('../helpers/invalid-param-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.accessToken = 'valid_token'
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, passowrd) {
      this.email = email
      this.password = passowrd
      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: '',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: ''
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.router()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no httpRequest no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.router({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    await sut.router(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizeError())
  })

  test('should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('should return 500 when if no authUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 when if has no auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AuthUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    authUseCaseSpy.accessToken = 'valid_token'
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_mail@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 500 when if has no auth method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 when if has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if EmailValidators throws', async () => {
    const authUseCase = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCase, emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call AuthUseCase with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_passowrd'
      }
    }
    await sut.router(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
