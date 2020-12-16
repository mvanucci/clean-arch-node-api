const MissingParamError = require('./missing-param-error')
const UnauthorizeError = require('./unauthorize-error')
const ServerError = require('./server-error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      body: new MissingParamError(paramName),
      statusCode: 400
    }
  }

  static serverError () {
    return {
      body: new ServerError(),
      statusCode: 500
    }
  }

  static unauthorizeError () {
    return {
      body: new UnauthorizeError(),
      statusCode: 401
    }
  }

  static ok (data) {
    return {
      body: data,
      statusCode: 200
    }
  }
}
