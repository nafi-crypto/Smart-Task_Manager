# 🧠 TaskFlow — Smart Task Management System

A full-stack Trello-like Kanban board app built with **Spring Boot + MongoDB** (backend) and **React + Tailwind + React Beautiful DnD** (frontend).

---

## 📁 Full Folder Structure

```
smart-task-manager/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/taskmanager/
│           │   ├── TaskManagerApplication.java
│           │   ├── config/
│           │   │   ├── CorsConfig.java
│           │   │   └── MongoConfig.java
│           │   ├── controller/
│           │   │   ├── BoardController.java
│           │   │   ├── ColumnController.java
│           │   │   └── CardController.java
│           │   ├── dto/
│           │   │   ├── BoardDTO.java
│           │   │   ├── ColumnDTO.java
│           │   │   └── CardDTO.java
│           │   ├── exception/
│           │   │   ├── GlobalExceptionHandler.java
│           │   │   └── ResourceNotFoundException.java
│           │   ├── model/
│           │   │   ├── Board.java
│           │   │   ├── Column.java
│           │   │   └── Card.java
│           │   ├── repository/
│           │   │   ├── BoardRepository.java
│           │   │   ├── ColumnRepository.java
│           │   │   └── CardRepository.java
│           │   └── service/
│           │       ├── BoardService.java
│           │       ├── ColumnService.java
│           │       └── CardService.java
│           └── resources/
│               └── application.properties
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── context/
        │   └── BoardContext.js
        ├── services/
        │   └── api.js
        ├── utils/
        │   └── helpers.js
        └── components/
            ├── Board/
            │   ├── BoardList.js
            │   └── BoardView.js
            ├── Header/
            │   └── BoardHeader.js
            ├── Column/
            │   ├── KanbanColumn.js
            │   └── AddColumnForm.js
            ├── Card/
            │   ├── TaskCard.js
            │   └── AddCardForm.js
            ├── Modals/
            │   ├── CardDetailModal.js
            │   └── CreateBoardModal.js
            └── Common/
                └── LoadingSpinner.js
```

---

## ⚙️ Prerequisites

| Tool         | Version     | Install                               |
|--------------|-------------|---------------------------------------|
| Java JDK     | 17+         | https://adoptium.net                  |
| Maven        | 3.8+        | https://maven.apache.org              |
| MongoDB      | 6.0+        | https://www.mongodb.com/try/download  |
| Node.js      | 18+         | https://nodejs.org                    |
| npm          | 9+          | bundled with Node.js                  |
| VS Code      | Latest      | https://code.visualstudio.com         |

---

## 🚀 Step-by-Step Setup in VS Code

### Step 1 — Clone / Open in VS Code

```bash
# Open the project folder in VS Code
code smart-task-manager
```

Install recommended VS Code extensions:
- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (VMware)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **MongoDB for VS Code**

---

### Step 2 — Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows — start from Services or run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name taskflow-mongo mongo:6.0
```

Verify MongoDB is running:
```bash
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

---

### Step 3 — Run the Backend (Spring Boot)

**In VS Code terminal:**

```bash
cd backend

# Build and run
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

**OR via VS Code:**
1. Open `TaskManagerApplication.java`
2. Click the ▶ **Run** button above `main()`
3. Or use `Ctrl+F5` to run without debugging

Backend starts on: **http://localhost:8080**

Verify with:
```bash
curl http://localhost:8080/api/boards
# Should return: []
```

---

### Step 4 — Run the Frontend (React)

Open a **new terminal** in VS Code (`Ctrl+Shift+\`):

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts on: **http://localhost:3000**

The browser should open automatically.

---

### Step 5 — Using the App

1. **Home page** — See all your boards
2. **Create a board** — Click "New Board", pick a color
3. **Board view** — 4 default columns: To Do, In Progress, In Review, Done
4. **Add cards** — Click "+ Add a card" in any column
5. **Drag & drop cards** — Drag between columns or reorder within a column
6. **Drag & drop columns** — Grab a column header and reorder
7. **Open card details** — Click any card to:
   - Edit title and description
   - Set priority (Low/Medium/High/Urgent)
   - Add labels (8 color options)
   - Set due date with date picker
   - Choose cover color
   - Add checklist items with progress bar
   - Add comments
   - Delete card
8. **Search cards** — Click 🔍 in the board header
9. **Edit column title** — Double-click column name
10. **Add columns** — Click "Add another list"

---

## 🔌 API Reference

### Boards
```
GET    /api/boards                    — List all boards
POST   /api/boards                    — Create board
GET    /api/boards/:id                — Get board by ID
PUT    /api/boards/:id                — Update board
DELETE /api/boards/:id                — Delete board
PATCH  /api/boards/:id/column-order   — Reorder columns
```

### Columns
```
GET    /api/boards/:boardId/columns   — Get columns for board
POST   /api/boards/:boardId/columns   — Create column
PUT    /api/columns/:id               — Update column
DELETE /api/columns/:id               — Delete column
PATCH  /api/columns/:id/card-order    — Reorder cards in column
POST   /api/columns/move-card         — Move card between columns
```

### Cards
```
GET    /api/columns/:columnId/cards   — Get cards in column
POST   /api/columns/:columnId/cards   — Create card
GET    /api/cards/:id                 — Get card by ID
PUT    /api/cards/:id                 — Update card
DELETE /api/cards/:id                 — Delete card
POST   /api/cards/:id/comments        — Add comment
POST   /api/cards/:id/checklist       — Add checklist item
PATCH  /api/cards/:id/checklist/:itemId/toggle — Toggle item
GET    /api/boards/:id/cards/search?q=query    — Search cards
```

---

## 🎨 Tech Stack Details

### Backend
| Technology         | Purpose                        |
|--------------------|--------------------------------|
| Spring Boot 3.2    | REST API framework             |
| Spring Data JPA    | MongoDB ORM                    |
| MongoDB            | NoSQL document database        |
| Lombok             | Boilerplate reduction          |
| Maven              | Dependency management          |

### Frontend
| Technology             | Purpose                          |
|------------------------|----------------------------------|
| React 18               | UI framework                     |
| React Router v6        | Client-side routing              |
| @hello-pangea/dnd      | Drag & Drop (react-beautiful-dnd)|
| Axios                  | HTTP client for API calls        |
| Tailwind CSS           | Utility-first styling            |
| React Icons            | Icon library                     |
| React DatePicker       | Calendar for due dates           |
| date-fns               | Date formatting utilities        |

---

## 🐛 Troubleshooting

**MongoDB connection refused:**
```bash
# Check if running
sudo systemctl status mongod
# Start if stopped
sudo systemctl start mongod
```

**CORS error in browser:**
- Confirm backend is running on port 8080
- Confirm frontend is running on port 3000
- CorsConfig.java already allows `http://localhost:3000`

**Port already in use:**
```bash
# Kill process on port 8080 (Mac/Linux)
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**`npm install` fails:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🌟 Features Summary

- ✅ Kanban board with drag-and-drop (cards + columns)
- ✅ Multiple boards with color themes
- ✅ Card details: title, description, priority, labels, due date, cover
- ✅ Checklists with progress tracking
- ✅ Comments per card
- ✅ Full-text card search
- ✅ Dark theme UI
- ✅ Fully persistent with MongoDB
- ✅ RESTful Spring Boot API
- ✅ Optimistic UI updates
#   S m a r t - T a s k - M a n a g e r  
 #   S m a r t - T a s k - M a n a g e r  
 