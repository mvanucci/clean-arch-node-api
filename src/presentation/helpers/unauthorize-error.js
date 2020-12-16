module.exports = class UnauthorizeError extends Error {
  constructor (paramName) {
    super('Unauthrize')
    this.name = 'UnauthorizeError'
  }
}
