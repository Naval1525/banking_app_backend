import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'
import { createAccount, getUserAccounts } from '../controllers/account.controller'

const router = Router()

router.use(authenticateToken)

router.post('/', createAccount)
router.get('/', getUserAccounts)

export default router