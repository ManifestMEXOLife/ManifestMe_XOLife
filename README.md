# ManifestME Platform

## 1. Overview
The ManifestME platform is a cloud-based application designed to help users define, track, and achieve personal goals aligned with vision statements across eight categories: Career & Business, Wealth & Finance, Health & Wellness, Relationships & Love, Personal Growth, Lifestyle & Social, Family & Home, and Spiritual & Purpose.

The architecture prioritizes scalability, security, user experience, and data privacy, supporting both web and mobile interfaces with features such as goal setting, progress tracking, motivational reminders, and community engagement.

---

## 2. Repository Structure (Monorepo)
This project is organized as a monorepo to house all client and server code in a single unified codebase.

* **`apps/backend`**:
    * **Role**: The core API and business logic engine.
    * **Tech**: Node.js, Express, TypeScript, Prisma (PostgreSQL).
    * **Key Responsibilities**: Authentication, Database interaction, Goal processing.
* **`apps/web-app`**:
    * **Role**: The responsive web interface for users.
    * **Tech**: React.js, Tailwind CSS.
* **`apps/ios-app`** *(Planned)*:
    * **Role**: Native mobile experience.
    * **Tech**: React Native.
* **`aws/`**:
    * **Role**: Infrastructure as Code (IaC) and cloud configuration.
* **`.github/`**:
    * **Role**: CI/CD workflows for automated testing and deployment.

---

## 3. System Components

### 3.1. Frontend
**Purpose**: Provides an intuitive, responsive user interface for web and mobile users to interact with goals and vision statements.

**Technologies**:
* **Web**: React.js for a dynamic, component-based UI, with Tailwind CSS for styling.
* **Mobile**: React Native for cross-platform iOS and Android apps, leveraging native components for performance.

**Features**:
* Dashboard to view and manage goals across categories.
* Form inputs for creating/editing goals (e.g., selecting from predefined vision statements like “I am financially independent” or adding custom ones).
* Progress tracking with visual indicators (e.g., progress bars, completion percentages).
* Notification settings for reminders (e.g., daily affirmations or goal check-ins).
* Community feed for sharing achievements and motivational content.
* **Accessibility**: WCAG 2.1 compliance for inclusive design.

### 3.2. Backend
**Purpose**: Handles business logic, data processing, and API services for frontend interactions.

**Technologies**:
* **Framework**: Node.js with Express.js for a lightweight, scalable API.
* **Language**: TypeScript for type safety and maintainability.
* **APIs**: RESTful APIs for CRUD operations. GraphQL considered for complex queries.

**Features**:
* User authentication and authorization (e.g., JWT-based sessions, role-based access).
* Goal management (e.g., categorization, progress updates, milestone tracking).
* Notification scheduling for reminders and motivational content.
* Analytics for user engagement and goal completion rates.
* **Deployment**: Docker containers orchestrated via Kubernetes for scalability and resilience.

### 3.3. Database
**Purpose**: Stores user data, goals, vision statements, and community interactions securely.

**Technologies**:
* **Primary Database**: PostgreSQL for relational data (users, goals, categories, progress logs).
* **Secondary Storage**: Redis for caching frequently accessed data (e.g., user sessions).
* **File Storage**: AWS S3 for user-uploaded content.

**Schema Overview**:
* **Users**: UserID, Email, Password (hashed), Preferences, Profile.
* **Goals**: GoalID, UserID, Category, VisionStatement, Progress, Milestones.
* **Community**: PostID, UserID, Content, Likes, Comments, Timestamp.

### 3.4. Integration Layer
**Purpose**: Connects the platform with external services for enhanced functionality.
* **Authentication**: OAuth 2.0 (Google, Apple, X).
* **Notifications**: Firebase Cloud Messaging (FCM) and SendGrid.
* **Analytics**: Google Analytics / Mixpanel.
* **Motivational Content**: AI-driven content generation (e.g., xAI API).

### 3.5. Infrastructure
* **Cloud Provider**: AWS.
* **Compute**: EC2 / EKS (Kubernetes).
* **Networking**: CloudFront (CDN), Route 53 (DNS).
* **Security**: AWS WAF, IAM, SSL/TLS.
* **CI/CD**: GitHub Actions.
* **Monitoring**: AWS CloudWatch, Sentry, ELK Stack.

---

## 4. System Flow
1.  **User Onboarding**: User signs up via SSO; Backend validates and stores in PostgreSQL; Session cached in Redis.
2.  **Goal Management**: Frontend sends updates; Backend processes request and triggers notifications.
3.  **Progress Tracking**: Frontend visualizes data; Backend calculates metrics.
4.  **Notifications**: Scheduled jobs (AWS Lambda) trigger push/email alerts.

---

## 5. Security Considerations
* **Authentication**: JWT tokens with refresh tokens (HTTP-only cookies).
* **Data Privacy**: GDPR/CCPA compliance.
* **Encryption**: TLS 1.3 (Transit) and AES-256 (Rest).
* **Access Control**: Role-based access (RBAC).

---

## 6. Scalability & Performance
* **Horizontal Scaling**: Kubernetes auto-scaling.
* **Caching**: Redis for low-latency session access.
* **Content Delivery**: CloudFront CDN for static assets.

---

## 7. Assumptions & Dependencies
* Users expect a cross-platform experience.
* Predefined vision statements are core but customizable.
* Relies on AWS services and third-party APIs for notifications/analytics.

---

## 8. High-Level Architecture Diagram

```mermaid
graph TD
    %% Nodes
    User([User])
    Client[Web / Mobile Frontend]
    Gateway[AWS API Gateway]
    Backend[Backend Service <br/> Node.js / Express]
    
    %% Data Stores
    DB[(PostgreSQL)]
    Cache[(Redis)]
    Storage[(AWS S3)]
    
    %% External Services
    External[External Services <br/> FCM, SendGrid, AI APIs]

    %% Connections
    User --> Client
    Client -->|HTTPS / REST| Gateway
    Gateway --> Backend
    
    subgraph AWS Cloud Infrastructure
        Backend -->|Read/Write| DB
        Backend -->|Cache Session| Cache
        Backend -->|Store Files| Storage
    end
    
    Backend -.->|API Calls| External