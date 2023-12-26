const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

const { checkSchema } = require('express-validator');
const {
    registerSchema,
    getUserSchema,
    editProfileSchema,
    loginSchema,
} = require('../helpers/validation');

/**
 * @swagger
 * /user/register:
 *  post:
 *      summary: Register new user in system
 *      tags: [Register]
 *      requestBody:
 *          required: true
 *          description: Firstname email and password
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - firstName
 *                      - email
 *                      - password
 *                    properties:
 *                      firstName:
 *                        type: string
 *                        example: Ivan
 *                      email:
 *                        type: string
 *                        example: example@example.com
 *                      password:
 *                        type: string
 *                        example: qwerty
 *      responses:
 *          200:
 *              description: The user was successfully registration
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - token
 *                    properties:
 *                      token:
 *                        type: string
 *                        example: i132nro2iu3br2u3bro2i3ro233nfwdfwef434f34f34f3
 *          401:
 *              description: Проблемы с аутентификацией или авторизацией
 *          500:
 *              description: Some server err
 */

// Registration
router.post(
    '/user/register',
    checkSchema(registerSchema),
    UserController.register
);

/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: Check user in system
 *      tags: [Login]
 *      requestBody:
 *          required: true
 *          description: Check email and password
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - email
 *                      - password
 *                    properties:
 *                      email:
 *                        type: string
 *                        example: example@example.com
 *                      password:
 *                        type: string
 *                        example: qwerty
 *      responses:
 *          200:
 *              description: The user was successfully login in system
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - token
 *                    properties:
 *                      token:
 *                        type: string
 *                        example: i132nro2iu3br2u3bro2i3ro233nfwdfwef434f34f34f3
 *          401:
 *              description: Проблемы с аутентификацией или авторизацией
 *          500:
 *              description: Some server err
 */

// Login
router.post('/user/login', checkSchema(loginSchema), UserController.login);

/**
 * @swagger
 * /profile/{id}:
 *  put:
 *      security:
 *      - bearerAuth: []
 *      summary: Редактирование пользователя по id
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric id of the user to get
 *      requestBody:
 *          required: true
 *          description: Update data
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      firstName:
 *                        type: string
 *                      lastName:
 *                        type: string
 *                      email:
 *                        type: string
 *                      gender:
 *                        type: string
 *                      photo:
 *                        type: string
 *                        format: binary
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          404:
 *              description: The device by id was not found
 *          500:
 *              description: Some server err
 */

// Edit profile

router.put(
    '/profile/:id',
    checkSchema(editProfileSchema),
    authMiddleware,
    uploadMiddleware,
    UserController.editProfile
);

/**
 * @swagger
 * /profile/{id}:
 *  get:
 *      security:
 *      - bearerAuth: []
 *      summary: Получить пользователя по id
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric id of the user to get
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          404:
 *              description: The device by id was not found
 *          500:
 *              description: Some server err
 */

// Get user profile by id
router.get(
    '/profile/:id',
    checkSchema(getUserSchema),
    authMiddleware,
    UserController.getUserProfile
);

/**
 * @swagger
 * /profiles:
 *  get:
 *      security:
 *      - bearerAuth: []
 *      summary: Получить всех пользователей
 *      tags: [User]
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          404:
 *              description: The device by id was not found
 *          500:
 *              description: Some server err
 */

// Get all users with pagination
router.get('/profiles', authMiddleware, UserController.getAllUsers);

module.exports = router;
