declare namespace Express {
  interface Request {
    user?: {
      id: string;
    };
  }
}
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      isAdmin?: boolean;
    }
  }
}