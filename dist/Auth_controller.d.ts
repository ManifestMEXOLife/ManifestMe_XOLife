import { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=Auth_controller.d.ts.map