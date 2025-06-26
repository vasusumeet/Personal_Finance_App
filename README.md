Personal Finance Manager
Overview
Personal Finance Manager is a full-stack web application that helps users track their expenses, incomes, and savings goals.
It provides insightful analytics, smart suggestions for budgeting, and a user-friendly interface for managing personal finances.

Features
Expense Tracking: Add, edit, delete, and categorize expenses.

Income Tracking: Record and review income entries.

Savings Goals: Set, monitor, and update savings goals with progress tracking.

Smart Suggestions: AI-powered tips to improve your spending habits (Python service).

Analytics: Visualizations and reports for better financial planning.

Authentication: Secure login and user data isolation.

Responsive UI: Works on desktop and mobile devices.

How To Run The Project
1. Clone the Repository
bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
2. Backend (Node.js/Express/MongoDB)
bash
cd backend
npm install
# Set up your .env file with MongoDB URI and JWT secret
npm start
# or for development with hot reload:
npm run dev
The backend will run on http://localhost:3000 by default.

3. Frontend (React)
bash
cd frontend
npm install
npm start
The frontend will run on http://localhost:3001 (or as configured).

4. Python Service (Flask for Smart Suggestions)
bash
cd flaskservice
pip install -r requirements.txt
# Set environment variables as needed (see .env.example)
python main.py
# Or for production:
gunicorn main:app
The Flask service will run on http://localhost:5001 by default.

Test Login Credentials
Username: admin Password: password@7
Add your test credentials here	

Live Demo
https://personal-finance-app-gamma-silk.vercel.app/

Extra Features
Payment method tracking for each expense

Inline editing of savings goals

Monthly reports and overbudget warnings

Deployed multi-service architecture (Node.js + Python Flask) on Railway

JWT-based authentication and secure API access
