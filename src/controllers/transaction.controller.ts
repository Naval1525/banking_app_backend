import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth'
import { createTransactionSchema } from '../types'
import * as transactionRepository from '../repositories/transaction.repository'
import * as accountRepository from '../repositories/account.repository'

export const createTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createTransactionSchema.parse(req.body)
    const userId = req.userId!

    // Verify user owns the debit account
    const debitAccount = await accountRepository.findAccountById(validatedData.debitAccountId)
    if (!debitAccount || debitAccount.userId !== userId) {
      res.status(403).json({ error: 'Access denied to debit account' })
      return
    }

    const transaction = await transactionRepository.createTransaction(validatedData)

    res.status(201).json(transaction)
  } catch (error) {
    console.error('Create transaction error:', error)

    if (error instanceof Error) {
      if (error.message === 'Insufficient funds' || error.message === 'One or both accounts not found') {
        res.status(400).json({ error: error.message })
        return
      }
    }

    res.status(500).json({ error: 'Transaction failed' })
  }
}

export const getAccountTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: accountId } = req.params
    const userId = req.userId!

    // Verify user owns the account
    const account = await accountRepository.findAccountById(accountId)
    if (!account || account.userId !== userId) {
      res.status(403).json({ error: 'Access denied to account' })
      return
    }

    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const transactions = await transactionRepository.findTransactionsByAccountId(
      accountId,
      limit,
      offset
    )

    res.json(transactions)
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}