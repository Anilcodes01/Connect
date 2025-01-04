import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || ""

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.error('No token provided');
         res.status(401).json({
            message: 'Access denied'
        });
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = (decoded as jwt.JwtPayload).userId;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
         res.status(403).json({
            message: 'Invalid token'
        });
        return
    }
};