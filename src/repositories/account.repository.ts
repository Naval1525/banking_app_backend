import { db } from '../lib/db'
import { CreateAccountInput } from '../types'

export const createAccount = async (userId:string,accountData:CreateAccountInput)=>{
    return db.account.create({
        data: {
          ...accountData,
          userId,
          type: accountData.type || 'CHECKING',
          currency: accountData.currency || 'USD'
        }
      })
}

export const findAccountsByUserId = async (userId:string)=>{
        return db.account.findMany({
            where:{userId},
            orderBy:{createdAt:'desc'}
        })
}

export const findAccountById = async (id:string)=>{
    return db.account.findUnique({
        where:{id}
    })
}

export const findAccountByIdWithUser = async (id: string) => {
    return db.account.findUnique({
      where: { id },
      include: { user: true }
    })
  }