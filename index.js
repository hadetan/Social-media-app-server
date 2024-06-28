const express = require('express');
const configs = require('./src/configs');
const dbConnect = require('./src/configs/dbConnect');
const mainRoute = require('./src/routes/index');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('cloudinary');
const bodyParser = require('body-parser');

const app = express();

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: configs.CLOUD_NAME,
    api_key: configs.CLOUD_API_KEY,
    api_secret: configs.CLOUD_API_SECRET,
    secure: true,
});

//Middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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
