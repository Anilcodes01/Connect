import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || ""

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({
            message: 'Access denied'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = (decoded as jwt.JwtPayload).userId;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({
            message: 'Invalid token'
        });
    }
};