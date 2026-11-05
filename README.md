# LinkLoop

A full-stack, real-time messaging web application (WhatsApp clone) built entirely from scratch in one month.

This project was built without relying on step-by-step tutorials or copied logic, focusing instead on fundamentally understanding how real-time messaging, secure APIs, and web sockets operate over the internet.

> **Note on Live Demo:** The live web demo is currently inactive because the backend Railway free trial has ended. You can still clone and run the project locally using the instructions below.

## Architecture & Repositories

The project is split into two main repositories to separate client and server logic:

* **Frontend Repository:** [notBehzad/LinkLoop_FrontEnd](https://github.com/notBehzad/LinkLoop_FrontEnd)
* **Backend API Repository:** [notBehzad/LinkLoop_API](https://github.com/notBehzad/LinkLoop_API)

## Tech Stack

* **Backend:** FastAPI (Python)
* **Frontend:** Web Client (HTML/CSS/JS)
* **Database & Real-time:** Firebase Realtime Database, WebSockets
* **Deployment & Hosting:** Vercel (Frontend), Railway (Backend)
* **Version Control:** Git & Bash

## Key Learnings & Technical Achievements

Building this from the ground up required solving several core engineering challenges:

* **Real-time Communication:** Implemented WebSockets as the heart of the application for instant message delivery without constant HTTP polling.
* **Database Synchronization:** Mastered Firebase Realtime DB, including sync listeners, efficient data transfer, and strict security rules.
* **API Architecture:** Designed secure, scalable endpoints using FastAPI, implementing robust authentication and understanding the "why" behind good API design.
* **Security & Access Control:** Enforced a strict server-side access model. Client-side JavaScript is prevented from exposing private data, ensuring that only the backend can authorize and fetch sensitive information.
* **DevOps & Secrets Management:** Handled deployments across Vercel and Railway, securely managing environment variables and API secrets in production environments.

## Running Locally

To get LinkLoop running on your local machine, you will need to set up both the backend API and the frontend client.

### 1. Backend Setup

```bash
# Clone the API repository
git clone https://github.com/notBehzad/LinkLoop_API.git
cd LinkLoop_API

# Install dependencies (assuming a virtual environment is activated)
pip install -r requirements.txt

# Set up your environment variables (.env)
# Add your Firebase credentials and any other required secrets

# Run the FastAPI server
uvicorn main:app --reload

```

### 2. Frontend Setup

```bash
# Open a new terminal and clone the frontend repository
git clone https://github.com/notBehzad/LinkLoop_FrontEnd.git
cd LinkLoop_FrontEnd

# Configure your API endpoints
# Ensure your frontend fetches data from http://localhost:8000 (or your FastAPI port)

# Launch a local development server
# You can use tools like Live Server in VS Code, or Python's built-in http.server:
python -m http.server 3000

```

## Feedback

Feedback and contributions are welcome! Feel free to open an issue or submit a pull request on either of the repositories if you have suggestions for improving the architecture, security, or UI.
