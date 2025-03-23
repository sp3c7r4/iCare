import type { NextFunction, Request, Response } from "express";

const tryCatch = (controller: (req: Request, res: Response) => Promise<void> ) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };

export default tryCatch;