const express = require('express');

require('dotenv').config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "SMTP2GO_USER", "SMTP2GO_PASSWORD", "APP_BASEURL"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Environment variable ${env} is missing`);
  }
});

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const bodyParserErrorHandler = require('express-body-parser-error-handler')
const swaggerOptions = require('./docs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

require('./middleware/db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParserErrorHandler());
app.use(cookieParser());
app.use(helmet());
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));

const swaggerDocs = swaggerJsDoc(swaggerOptions.swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../files/', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ message: 'File not found' });
        }

        try {
            res.sendFile(filePath);
        } catch (err) {
            res.status(500).send({ message: 'Error retrieving file' });
        }
    });
});

app.get('/', function (req, res) {
    res.redirect('/api/v1/docs');
});
app.use(errorHandler)


module.exports = app