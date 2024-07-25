import { Request } from 'express';

interface AuthRequestProps {
  user?: any; // or a more specific type if you know the shape of the user object
}

declare global {
  namespace Express {
    interface Request extends AuthRequestProps {}
  }
}

export type AuthRequest = Request & AuthRequestProps;
