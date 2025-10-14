export interface User {
    id: number;
    email: string;
    name?: string;
    gender?: string;
    dob?: Date;
    avatarUrl?: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    goals?: Goal[];
    journals?: JournalEntry[];
}
export interface Goal {
    id: number;
    userId: number;
    title: string;
    description?: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    microGoals?: MicroGoal[];
    videoId?: number;
}
export interface MicroGoal {
    id: number;
    goalId: number;
    title: string;
    dueDate?: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface JournalEntry {
    id: number;
    userId: number;
    mood?: string;
    moodScore?: number;
    content?: string;
    createdAt: Date;
}
export interface Video {
    id: number;
    provider: string;
    providerId: string;
    url: string;
    createdAt: Date;
}
//# sourceMappingURL=BackEnd_FrontEnd_Entities%20Models).d.ts.map