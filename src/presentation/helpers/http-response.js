const MissingParamError = require('./missing-param-error')
const UnauthorizeError = require('./unauthorize-error')
module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      body: new MissingParamError(paramName),
      statusCode: 400
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }

  static unauthorizeError () {
    return {
      body: new UnauthorizeError(),
      statusCode: 401
    }
  }
}
