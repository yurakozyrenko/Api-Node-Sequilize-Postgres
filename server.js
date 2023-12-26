const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const sequelize = require('./models/index');
app.use(express.json());
require('./models');
const router = require('./routes/index');
const PORT = process.env.PORT || 5000;
app.use('/', router);

app.use('/photos', express.static(path.join(__dirname, '../static')));

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Тестовое задание для соискателя backend Node.js',
            version: '1.0.0',
            description:
                'API для работы с пользователями. Express + MySQL + Sequelize',
            contact: {
                name: 'Amazing Developer',
            },
            servers: ['http://localhost:5000'],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                },
            },
        },
    },
    apis: ['./routes/*js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с БД было успешно установлено');
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
    } catch (e) {
        console.log('Невозможно выполнить подключение к БД: ', e);
    }
};
start();
