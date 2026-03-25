# ⚡ AI Flow App

A visual AI prompt-response app built with the MERN stack + React Flow.


## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ai-flow-app.git
cd ai-flow-app
```

### 2. Setup Backend
```bash
cd backend
npm install
cp  .env   
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 🔑 Environment Variables (`backend/.env`)

| Variable | Where to get it |
|----------|----------------|
| `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) → Keys (free) |
| `MONGODB_URI` | [cloud.mongodb.com](https://cloud.mongodb.com) → Connect |
| `PORT` | Default: `5000` |

---

##  How to Use

1. **Type** a question in the left node
2. **Click "▶ Run Flow"** to get an AI response
3. **Click "💾 Save"** to store it in MongoDB
4. **Click "📚 History"** to view saved conversations

---

## 🛠 Tech Stack

- **Frontend** — React, React Flow
- **Backend** — Node.js, Express
- **Database** — MongoDB Atlas
- **AI** — OpenRouter API (free model)
