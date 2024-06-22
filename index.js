const express = require('express');
const config = require('./src/configs/index');
const dbConnected = require('./src/configs/dbConnect');
const routes = require('./src/routes/index');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('common'));

app.use('/api', routes);

app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
    });
});

dbConnected();

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
