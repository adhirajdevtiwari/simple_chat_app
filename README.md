# Full-Stack Backend & AI Suite

A comprehensive collection of backend projects demonstrating secure authentication, real-time communication, and modern AI-powered vector storage integrations.

## 🚀 Projects Overview

This repository is organized into four distinct modules:

### 1. [AUTH-Complete](./AUTH-Complete)
A production-ready authentication system built with **Node.js, Express, and MongoDB**.
- **Key Features**: 
  - JWT-based authentication with secure session management.
  - Refresh Token rotation for enhanced security.
  - MongoDB session storage to track active devices.
- **Technologies**: Express, Mongoose, JWT, Cookie-Parser.

### 2. [Chat Application](./chatapp)
A real-time messaging platform using **Socket.io**.
- **Key Features**: 
  - Instant message broadcasting to all connected users.
  - Active client count tracking.
  - Custom-styled UI with a modern blue theme and custom scrollbars.
- **Technologies**: Socket.io, Express, CSS3.

### 3. [LangChain AI & Vector Storage](./Langchain)
An AI-driven pipeline for document processing and semantic search.
- **Key Features**: 
  - Large document splitting using `RecursiveCharacterTextSplitter`.
  - Semantic embeddings generation via **Google Gemini API**.
  - High-performance vector storage and retrieval in **Supabase (PostgreSQL pgvector)**.
- **Technologies**: LangChain, Google Generative AI, Supabase.

### 4. [Auth1](./Auth1)
A simplified reference implementation of basic authentication and database connectivity.
- **Technologies**: Express, MongoDB.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adhirajdevtiwari/simple_chat_app.git
   cd simple_chat_app
   ```

2. **Module Setup**:
   Each module is independent. Navigate to a folder and install dependencies:
   ```bash
   # Example for Auth module
   cd AUTH-Complete && npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the respective project folder:

   **For AUTH-Complete**:
   ```env
   Mongo_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   **For Langchain**:
   ```env
   sbURL=your_supabase_project_url
   sbAPIkey=your_supabase_service_role_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

## 📜 License
This project is open-source and available under the ISC License.

---
*Developed as a showcase of modern backend and AI engineering capabilities.*
