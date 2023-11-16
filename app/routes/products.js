const productController = require('../controllers/productController');
const propositionController = require('../controllers/propositionController');
const router = require('express').Router()
const auth = require('../middleware/auth')
const ValidationSchemas = require('./productsValidation')
const upload = require('../middleware/fileCheck')

/**
 * @openapi
 * /products/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all products from a user
 *     description: Retrieve detailed information about all products from a specific user by their unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to retrieve products from
 *         schema:
 *           type: string
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
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.get('/user/:id', auth(), productController.getAllProductsFromTarget);

/**
 * @openapi
 * /products/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all products from the authenticated user
 *     description: Retrieve detailed information about all products from the authenticated user. Requires authentication.
 *     tags:
 *       - Products
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
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   pictures:
 *                     type: array
 *                     items:
 *                       type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.get('/me', auth(), productController.getAllProductsFromUser);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new Product
 *     tags: [Products]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             postcode:
 *               type: string
 *             category:
 *               type: string
 *             pictures:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */
router.post('/', auth(), upload.array('pictures', 6), ValidationSchemas.createProductSchema, productController.createProduct);


/**
 * @openapi
 * /products/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a product by its ID
 *     description: Retrieve detailed information about a specific product by its unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 pictures:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.get('/:id', auth(), productController.getProductById);


/**
 * @openapi
 * /products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a product
 *     description: Update a specific product by its unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 pictures:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.put('/:id', auth(), ValidationSchemas.updateProductSchema, productController.updateProduct);

/**
 * @openapi
 * /products/{id}/pictures:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add pictures to a product
 *     description: Add pictures to a specific product by its unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to add pictures to
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 pictures:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.post('/:id/pictures', auth(), upload.array('pictures', 6), productController.addProductPics);


/**
 * @openapi
 * /products/{id}/pictures:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove pictures from a product
 *     description: Remove pictures from a specific product by its unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to remove pictures from
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pictureNames:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.delete('/:id/pictures', auth(), ValidationSchemas.removeProductPics, productController.removeProductPics);


/**
 * @openapi
 * /products/verify/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Verify a product
 *     description: Verify a specific product by its unique ID. Requires admin authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to verify
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated or not admin
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.post('/:id/verify', auth('Admin'), productController.verifyProduct);


/**
 * @swagger
 * /products/browse:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Browse products
 *     description: Browse products with optional search criteria. Requires user authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: text
 *         required: false
 *         description: Text to be contained in the product's title or description
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: Maximum price of the product
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxDistance
 *         required: false
 *         description: Maximum distance from the postcodes's location
 *         schema:
 *           type: number
 *       - in: query
 *         name: category
 *         required: false
 *         description: Category of the product
 *         schema:
 *           type: string
 *       - in: query
 *         name: postcode
 *         required: false
 *         description: Postcode of the user's location for distance calculation
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '500':
 *         description: Server Error
 */
router.get('/', auth(), ValidationSchemas.browseProductsSchema, productController.browseProducts);


/**
 * @openapi
 * /products/{id}/bid:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a proposition
 *     description: Create a proposition for a specific product by its unique ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the product to create a proposition for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Not Found, product with provided ID does not exist
 *       '500':
 *         description: Server Error
 */
router.post('/:id/bid', auth(), ValidationSchemas.createPropositionSchema, propositionController.createProposition);


router.put('/bid/:id', auth(), ValidationSchemas.createPropositionSchema, propositionController.changeProposition);

router.post('/bid/:id/accept', auth(), propositionController.acceptProposition);

router.post('/bid/:id/decline', auth(), propositionController.declineProposition);

module.exports = router;