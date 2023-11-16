const userController = require('../controllers/userController')
const propositionController = require('../controllers/propositionController')
const validateRequest = require('../middleware/validateRequest')
const router = require('express').Router()
const auth = require('../middleware/auth')
const ValidationSchemas = require('./usersValidation')

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - repeatPassword
 *               - email
 *               - fullName
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               repeatPassword:
 *                 type: string
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/register', ValidationSchemas.registerSchema, userController.register);

/**
 * @openapi
/users/verify:
 *   get:
 *     summary: Verify a new account (GET method with parameters)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 *   post:
 *     summary: Verify a new account (POST method with body)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.get('/verify', ValidationSchemas.verifyEmailSchema, userController.verifyEmail);
router.post('/verify', ValidationSchemas.verifyEmailSchema, userController.verifyEmail);


/**
 * @openapi
 * /users/forgot-password:
 *   post:
 *     summary: Send email for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/forgot-password', ValidationSchemas.forgotPasswordSchema, userController.forgotPassword);

/**
 * @openapi
 * /users/reset-password:
 *   post:
 *     summary: Reset a user's password (with token)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - repeatPassword
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               repeatPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/reset-password', ValidationSchemas.resetPasswordSchema, userController.resetPassword);

/**
 * @openapi
 * /users/change-password:
 *   post:
 *     summary: Change the authenticated user's password
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - repeatPassword
 *             properties:
 *               password:
 *                 type: string
 *               repeatPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/change-password', auth(), ValidationSchemas.changePasswordSchema, userController.changePassword);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/login', ValidationSchemas.loginSchema, userController.login);

/**
 * @swagger
 * /users/bids:
 *   get:
 *     summary: Retrieve a list of bids
 *     description: Retrieve a list of bids made by the user. This route is only accessible to authenticated users.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   price:
 *                     type: number
 *                   text:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get('/bids', auth(), propositionController.viewPropositions);

module.exports = router;
