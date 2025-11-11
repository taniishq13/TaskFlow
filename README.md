# TaskFlow - Modern Task Management Application

A beautiful, full-stack task management application built with modern web technologies and enhanced with Lucide icons for a polished UI experience.

## 🚀 Features

- **Smart Task Management** - Create, organize, and track tasks with priority levels and due dates
- **User Authentication** - Secure registration and login system with bcrypt password hashing
- **Real-time Updates** - Instant task updates with optimistic UI rendering
- **Beautiful UI** - Modern design with Lucide icons replacing emojis for a professional look
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Priority System** - Four priority levels (Low, Medium, High, Urgent) with visual indicators
- **Task Filtering** - Sort tasks by date, priority, or completion status
- **Secure Backend** - Built with Express.js, Prisma ORM, and MySQL database

## 📦 Tech Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - Vanilla JS with class-based architecture
- **Lucide Icons** - Beautiful, consistent iconography

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Modern ORM for database management
- **MySQL** - Relational database
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd TaskFlow
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/taskflow_db"

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### Step 5: Start the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:5500`

## 📁 Project Structure

```
LastMinProject/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration files
├── public/
│   ├── css/
│   │   └── style.css         # Application styles
│   ├── js/
│   │   └── app.js            # Frontend JavaScript
│   ├── images/               # Static images
│   └── index.html            # Main HTML file
├── server.js                  # Express server & API routes
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (create this)
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check

- `GET /api/health` - Server health status

## 🎯 Usage Guide

### Creating a Task

1. Register or login to your account
2. Enter task title (required)
3. Add description (optional)
4. Set due date (optional)
5. Choose priority level
6. Click "Add Task"

### Managing Tasks

- **Complete Task** - Click the checkbox
- **Edit Task** - Click the "Edit" button
- **Delete Task** - Click the "Delete" button
- **Sort Tasks** - Use the filter dropdown

### Priority Levels

- **Low** - Green badge with down arrow icon
- **Medium** - Yellow badge with minus icon
- **High** - Orange badge with up arrow icon
- **Urgent** - Red badge with alert icon

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- SQL injection prevention via Prisma ORM
- XSS protection through HTML escaping

## 🎨 Customization

### Changing Colors

Edit CSS variables in `public/css/style.css`:

```css
:root {
  --primary-color: #ff3cac;
  --secondary-color: #00dbde;
  --success-color: #00c897;
  /* ... more variables */
}
```

### Adding New Icons

Browse [Lucide Icons](https://lucide.dev/icons) and add them using:

```html
<i data-lucide="icon-name"></i>
```

Then reinitialize:

```javascript
lucide.createIcons();
```

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Icons Not Showing

- Check browser console for errors
- Verify Lucide CDN is loading
- Ensure `lucide.createIcons()` is called

### Port Already in Use

- Change PORT in `.env`
- Or kill process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

## 📚 MCP (Model Context Protocol) Integration

This project is designed to work seamlessly with MCP-enabled AI assistants. The codebase follows best practices for:

- **Clear Documentation** - Comprehensive inline comments
- **Modular Architecture** - Separation of concerns
- **RESTful API Design** - Standard HTTP methods and status codes
- **Error Handling** - Consistent error responses
- **Type Safety** - Prisma schema provides type definitions

### Using with MCP Tools

AI assistants can interact with this project through:

- File reading/editing tools
- Command execution for database operations
- Code analysis and refactoring
- Documentation generation

## 🚀 Deployment

### Heroku

```bash
heroku create taskflow-app
heroku addons:create jawsdb:kitefin
git push heroku main
```

### Vercel/Netlify

- Frontend can be deployed as static site
- Backend requires serverless function adaptation

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues or questions:

- Open an issue on GitHub
- Check existing documentation
- Review API endpoints in `server.js`

## 🎉 Acknowledgments

- **Lucide Icons** - Beautiful icon library
- **Prisma** - Excellent ORM
- **Express.js** - Robust web framework
- **Inter Font** - Clean typography

---

**Built with ❤️ for productivity**

Last Updated: 2025-11-11
