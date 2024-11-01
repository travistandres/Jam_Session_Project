const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Import routes
const usersRouter = require('./routes/Users.cjs');
const projectsRouter = require('./routes/Projects.cjs');
const userProjectsRouter = require('./routes/UserProjects.cjs');
const textFilesRouter = require('./routes/TextFiles.cjs');
const audioFilesRouter = require('./routes/AudioFiles.cjs');

// Use routes
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/userProjects', userProjectsRouter);
app.use('/api/textFiles', textFilesRouter);
app.use('/api/audioFiles', audioFilesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
