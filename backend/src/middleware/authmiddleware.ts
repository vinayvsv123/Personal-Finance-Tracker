import jwt from 'jsonwebtoken';
import type{ Request, Response, NextFunction } from 'express';
import { decode } from 'node:punycode';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
    req: AuthRequest, res: Response, next: NextFunction
   ) => {
    try{
        const token=req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"Access denied. No token provided."});
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET as string) as {id:string, email:string};
        req.user=decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid token."});
    }
};