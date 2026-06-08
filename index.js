const app = require('./config/express');
const router = require('./routes/UserRoutes');




app.use('/', router);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});