import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'
import { createTransaction, getAccountTransactions } from '../controllers/transaction.controller'

const router = Router()

router.use(authenticateToken)

router.post('/', createTransaction)
router.get('/account/:id', getAccountTransactions)

export default router