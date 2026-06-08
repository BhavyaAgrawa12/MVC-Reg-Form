const app = require('./config/express');
const router = require('./routes/UserRoutes');
const connectDB = require('./config/database');

app.use('/', router);

const PORT = process.env.PORT || 8080;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();