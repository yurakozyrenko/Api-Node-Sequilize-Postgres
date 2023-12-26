const Router = require('express');
const router = new Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - firstName
 *          - email
 *          - password
 *        properties:
 *          firstName:
 *            type: string
 *            description: firstName
 *          email:
 *            type: string
 *            description: email
 *          password:
 *            type: string
 *            description: password
 *        example:
 *            firstName: Ivan
 *            email: example@example.com
 *            password: qwerty
 */

const userRouter = require('./users.routes');
router.use('/', userRouter);

module.exports = router;
