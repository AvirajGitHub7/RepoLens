# RepoLens

![RepoLens Hero Placeholder](./public/hero-placeholder.png) <!-- Update this path once a real hero image is added -->

RepoLens is an intelligent, AI-powered codebase analysis platform that provides deep insights into any GitHub repository. By generating architectural summaries, extracting key technical narratives, and synthesizing HR and interview questions based on the actual code, RepoLens bridges the gap between raw source code and human-readable project documentation.

## Features

- **Seamless GitHub Integration:** Directly connect your GitHub account to analyze your repositories securely, including private ones, without manual URL pasting.
- **AI-Powered Code Analysis:** Uses Google's Gemini to parse codebases and deliver comprehensive summaries, architecture breakdowns, and data flow explanations.
- **Interview & HR Prep:** Automatically generates technical interview questions, behavioral HR questions, and system design challenges based on the project's complexity and tech stack.
- **Dynamic Dashboard:** A sleek, fully responsive dashboard built with modern web design principles (glassmorphism, vibrant dark mode).
- **Secure Authentication:** Firebase-powered authentication ensuring your data and tokens stay private (session-based GitHub tokens that are never persisted).
- **Export & Share:** Export your reports beautifully to PDF or share them with one click.

## Screenshots

<div align="center">
  <img src="./public/screenshot-dashboard.png" alt="Dashboard View Placeholder" width="45%" />
  <img src="./public/screenshot-analysis.png" alt="Analysis View Placeholder" width="45%" />
</div>

> **Note:** Replace the placeholder image paths in `./public` with real screenshots of your application before sharing the repository.

## Architecture

RepoLens is built on a scalable, modern architecture:

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router) combined with React 19. It uses TailwindCSS for utility-first styling and Framer Motion for buttery-smooth micro-interactions.
- **Backend/BFF (Backend-For-Frontend):** Next.js Server Actions and API Routes securely handle orchestration and API communication.
- **Database & Auth:** [Firebase](https://firebase.google.com/) provides robust Authentication (Google & GitHub) and NoSQL Document Storage (Firestore) for persisting analyses.
- **AI Engine:** Google Gemini (`@google/genai`) processes the repository structure and contents to generate dynamic insights.

### Repository Fetching Strategy
GitHub Tokens acquired during authentication are temporarily stored in `sessionStorage`. When an analysis is requested, the token is passed securely to the backend orchestration service via an API, where the repository is cloned/fetched, analyzed, and the result is stored in Firestore. **Tokens are never saved to the database.**

## Tech Stack

- **Framework:** Next.js (TypeScript)
- **UI & Styling:** TailwindCSS, Shadcn UI, Framer Motion, Lucide Icons
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **AI Integration:** Google Gemini AI

## Setup Instructions

### Prerequisites

- Node.js (v20+ recommended)
- A Firebase Project (with Firestore & Authentication enabled)
- A Google Gemini API Key
- A GitHub Personal Access Token (for global fallback usage)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/RepoLens.git
cd RepoLens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and populate it with your specific keys. **Do not commit this file.**

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# GitHub (Fallback token for public repositories)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

RepoLens is configured to be easily deployed to Firebase Hosting or Vercel.

### Firebase Hosting

1. Ensure you have the Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log into Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting (if not already done):
   ```bash
   firebase init hosting
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## License

This project is licensed under the MIT License.
