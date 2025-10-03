generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String?
  gender       String?
  dob          DateTime?
  avatarUrl    String?
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  goals        Goal[]
  journals     JournalEntry[]
}

model Goal {
  id          Int         @id @default(autoincrement())
  user        User        @relation(fields: [userId], references: [id])
  userId      Int
  title       String
  description String?
  category    String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  microGoals  MicroGoal[]
  video       Video?      @relation(fields: [videoId], references: [id])
  videoId     Int?
}

model MicroGoal {
  id         Int      @id @default(autoincrement())
  goal       Goal     @relation(fields: [goalId], references: [id])
  goalId     Int
  title      String
  dueDate    DateTime?
  completed  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model JournalEntry {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  mood      String?  // e.g., "happy", or an emoji, or numeric scale
  moodScore Int?     // optional numeric mood scale (1-5)
  content   String?
  createdAt DateTime @default(now())
}

model Video {
  id          Int      @id @default(autoincrement())
  provider    String   // e.g., "mock", "d-id"
  providerId  String   // vendor id
  url         String
  createdAt   DateTime @default(now())
  goal        Goal?
}
