import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth'
import { createAccountSchema } from '../types'
import * as accountRepository from '../repositories/account.repository'

export const createAccount = async (req:AuthenticatedRequest,res:Response):Promise<void>=>{
    try{
        const validatedData = createAccountSchema.parse(req.body)
        const userId = req.userId!
        const account = await accountRepository.createAccount(userId,validatedData)
        res.status(201).json(account)

    }catch(error){
        console.error(error)
        res.status(500).json({error:'Internal server error'})
    }
}

export const getUserAccounts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!
      const accounts = await accountRepository.findAccountsByUserId(userId)

      res.json(accounts)
    } catch (error) {
      console.error('Get accounts error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }