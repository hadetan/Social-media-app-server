const express = require('express');
const configs = require('./src/configs');
const dbConnect = require('./src/configs/dbConnect');
const mainRoute = require('./src/routes/index');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('common'));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    })
);

//Routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'ok',
    });
});

app.use('/api', mainRoute);

// Connection
dbConnect();
PORT = configs.PORT;
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
