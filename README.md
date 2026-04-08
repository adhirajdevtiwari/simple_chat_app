# Auth & Chat & AI - Complete Backend Suite

A comprehensive collection of backend projects demonstrating authentication, real-time communication, and AI-powered vector storage.

## 📁 Project Structure

This repository contains three main modules:

### 1. [AUTH-Complete](./AUTH-Complete)
A robust authentication system built with **Node.js, Express, and MongoDB**.
- **Features**: JWT-based authentication, Refresh Token rotation, and Secure Session management.
- **Key Modules**: 
  - `src/controllers/auth.controller.js`: Core logic for user registration and session validation.
  - `src/models/session.model.js`: Session schema for tracking active user devices.

### 2. [Chat App](./chatapp)
A real-time chat application using **Socket.io**.
- **Features**: Real-time message broadcasting, active client count, and customized UI.
- **Tech Stack**: Node.js, Socket.io, Express.

### 3. [Langchain AI](./Langchain)
An AI integration module focusing on document processing and vector storage.
- **Features**: Document splitting, generating embeddings using **Google Gemini**, and storing them in **Supabase Vector Store**.
- **Tech Stack**: LangChain, Google Generative AI, Supabase.

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB instance (for Auth)
- Supabase account (for Langchain)
- Google AI Studio API Key (for Gemini)

### Installation
Clone the repository and install dependencies for each module:

```bash
# Auth module
cd AUTH-Complete && npm install

# Chat app
cd ../chatapp && npm install

# Langchain module
cd ../Langchain && npm install
```

### Configuration
Create `.env` files in each directory with the following variables:

**AUTH-Complete/.env**
```env
Mongo_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

**Langchain/.env**
```env
sbURL=your_supabase_url
sbAPIkey=your_supabase_service_role_key
GEMINI_API_KEY=your_google_ai_key
```

## 🛠️ Built With
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **LangChain** - AI orchestration
- **Mongoose** - MongoDB modeling
- **Supabase** - Vector database
- **Google Gemini** - Embedding model

---
*Created as a comprehensive backend learning suite.*
