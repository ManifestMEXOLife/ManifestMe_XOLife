import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<{
    log: ("error" | "query" | "warn")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
//# sourceMappingURL=BackEnd_FrontEnd_PostgreSQL_Connection.d.ts.map