import { db } from '../lib/db'
import { CreateUserInput } from '../types'

export const createUser = async (userData: CreateUserInput & { password: string }) => {
    return db.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })
  }

export const findUserByEmail = async (email:string)=>{
    return db.user.findUnique({
      where: { email }
    })
}

export const findUserById = async(userId:string)=>{
    return db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })
}
