
module.exports = () => {
  router.post('/sinup', new SignUpRouter().router)
}

const express = require('express')
const router = express.Router()

// sinup-router
class SignUpRouter {
  async route (req, res) {
    const { email, password, repeatPassword } = req.body
    if (password === repeatPassword) {
      new SignUpUseCase().signUp(email, password, repeatPassword)
    }
    res.status(400).json({ error: ' password must be equal to repeatPassword' })
  }
}

const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

// sinup-use case
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      const user = await AccountModel.create({ email, password })
      return user
    }
  }
}
