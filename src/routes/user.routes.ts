import express from 'express'
import { registerUser } from '../controllers/user.controller';

const router = express.Router()

router.post('/register', (req, res) => {
  const register = registerUser(req.body)
  res.status(register.statusCode).send(register)
})
export default router;