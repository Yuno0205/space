# 🚀 Space - Yuno's Personal Workspace

Welcome to Space! This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). "Space" serves as my personal digital playground for learning, coding, and exploring new technologies. Think of it as a journey where each new concept is a star, and every breakthrough is reaching a new orbit.

**Current Version:** 1.0.0

## 🌌 Project Overview

"Space" is a personal learning and development hub featuring several key modules:

* 📚 **English Learning Suite:** Tools for vocabulary acquisition, AI-powered speaking practice (EVI), and listening exercises.
* ✍️ **Personal Blog:** Content driven by WordPress, allowing for easy content management and updates.
* 📊 **Dashboard:** A central hub to track learning progress and manage tasks efficiently.

## ✨ Core Technologies

This project is built with a modern tech stack:

* **Framework:** Next.js 15.2.4
* **Language:** TypeScript 5
* **UI:** React 19.0.0, Tailwind CSS, Shadcn/UI, Framer Motion
* **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)
* **AI Voice Interface:** Hume AI
* **Blog CMS:** WordPress (via REST API)
* **Icons:** Lucide React
* **Animations:** Lottie React

(Based on `package.json`, `tailwind.config.ts`, `next.config.ts`)

## 🎯 Key Features

* **Homepage (`app/page.tsx`):** A welcoming introduction with project stats, highlighted modules, and current "missions" (learning goals).
* **English Learning Hub (`app/english/**`):**
    * 🗣️ **Empathic Voice Interface (EVI):** Conversational practice with an AI that understands and responds to tone.
    * 📇 **Vocabulary Practice:** Interactive flashcards with audio, definitions, and examples.
    * 🎤 **Speaking Practice:** Pronunciation exercises with detailed feedback.
    * 🎧 **Listening Practice:** Comprehension exercises.
* **Blog (`app/blog/**`):** Articles fetched from WordPress, with search and category filtering.
* **Dashboard (`app/dashboard/page.tsx`):** Includes a Learning Progress tracker, Pomodoro Timer, Resource Collection, and Task Manager.
* **Modern UI/UX:** Features a collapsible sidebar, breadcrumbs for navigation, a Dark/Light theme toggle, and utilizes components from Shadcn/UI.
* **Engaging Animations:** Lottie and Framer Motion are used for dynamic visual effects.

## 🏁 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
