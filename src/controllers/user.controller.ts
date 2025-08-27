import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "../types";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import * as userRepository from "../repositories/user.repository";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const existingUser = await userRepository.findUserByEmail(
      validatedData.email
    );
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const hashedPassword = await hashPassword(validatedData.password);
    const user = await userRepository.createUser({
      ...validatedData,
      password: hashedPassword,
    });
    const token = generateToken({ userId: user.id });

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(400).json({ error: "Invalid input data" });
  }
};


export const loginUser = async(req:Request,res:Response):Promise<void>=>{
    try{
        const validatedData = loginSchema.parse(req.body);
        const user = await userRepository.findUserByEmail(validatedData.email)
        if(!user){
            res.status(400).json({error:"Invalid email or password"})
            return
        }
        const isPasswordValid = await comparePassword(validatedData.password,user.password)
        if(!isPasswordValid){
            res.status(400).json({error:"Invalid email or password"})
            return
        }
        const token = generateToken({userId:user.id})
        res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                createdAt:user.createdAt
            },
            token
        })

    }
    catch(error){
        console.error("Login error:",error)
        res.status(400).json({error:"Invalid input data"})
    }
}

