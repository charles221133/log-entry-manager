# Log Entry App

A full-stack application for logging and managing event entries, built with React (Vite, TypeScript) frontend and Express/SQLite backend.

---

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Usage](#usage)
- [Known Limitations & Future Enhancements](#known-limitations--future-enhancements)

---

## Overview
This app allows users to create, view, edit, and delete log entries with fields for user name, description, event date, and location. The frontend is a responsive React app; the backend is a RESTful API using Express and SQLite.

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript, SQLite (better-sqlite3)
- **Testing:** Jest (backend)

---

## Project Structure
```
BezosAcademyTest/
├── backend/
│   ├── src/
│   │   ├── index.ts         # Express app entry
│   │   ├── database.ts      # SQLite connection & utilities
│   │   ├── routes/
│   │   │   └── logs.ts      # Log entry API routes
│   │   └── database.test.ts # Jest unit tests
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── services/        # API service functions
│   │   └── ...
│   ├── package.json
│   └── ...
├── README.md                # (This file)
└── ...
```

---

## Setup & Installation

### Backend
1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. (First time only) Ensure SQLite is available (no extra install needed for better-sqlite3).

### Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

---

## Running the Application

### 1. Start the Backend
From the `backend` directory:
```sh
npx ts-node src/index.ts
```
- The backend will run on [http://localhost:3001](http://localhost:3001)

### 2. Start the Frontend
From the `frontend` directory:
```sh
npm run dev
```
- The frontend will run on [http://localhost:5173](http://localhost:5173)

---

## Running Tests

### Backend Unit Tests
From the `backend` directory:
```sh
npx jest
```
- Runs Jest tests for database CRUD operations.

---

## Usage
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Add, edit, and delete log entries using the UI.
- The user name field is remembered after your first entry (auto-fills for future entries).
- Entries are stored in a local SQLite database (`backend/log_entries.db`).

---

## Known Limitations & Future Enhancements
- No authentication or user management (single-user, local only).
- No pagination or search for log entries.
- No deployment scripts (local development only).
- No frontend unit tests (backend only).
- Future: Add user authentication, deploy to cloud, add more advanced filtering/sorting, add frontend tests.

---

## License
MIT (or specify your license here) 