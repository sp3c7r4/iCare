import express, { type Request, type Response } from 'express'
import { registerUser, startChat } from '../controllers/user.controller';
import tryCatch from '../utils/tryCatch';

const router = express.Router()

router.post('/register', async (req, res) => {
  const register = await registerUser(req.body)
  res.status(register.statusCode).send(register);
})

router.post('/test', tryCatch( async (req: Request, res: Response) => {
  const { text, user_id } = req.body;
  const response = await startChat(text, user_id);
  res.send(response);
}))


export default router;