import { Request, Response } from "express";
export declare const createGoal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addMicroGoal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProgress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=GoalsController.d.ts.map