/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobileNumber:
 *                 type: number
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Registered Successfully.
 *       400:
 *         description: Missing required fields.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Missing required fields.
 */

/**
 * @swagger
 * /email-verification:
 *   post:
 *     summary: Verify user email
 *     description: Marks the user's email as verified.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid request.
 */

/**
 * @swagger
 * /password-reset:
 *   post:
 *     summary: Reset user password
 *     description: Resets a user's password after verification.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               mobileNumber:
 *                 type: number
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Missing required fields.
 */

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: List all users (Admin only)
 *     description: Retrieves a list of all registered users.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users.
 */

/**
 * @swagger
 * /admin/update-role:
 *   put:
 *     summary: Update user role (Admin only)
 *     description: Updates a user's role.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *       400:
 *         description: Invalid request.
 */

/**
 * @swagger
 * /admin/manage:
 *   delete:
 *     summary: Enable or disable users (Admin only)
 *     description: Enables or disables a user account.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               isDeleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       400:
 *         description: Invalid request.
 */

/**
 * @swagger
 * /password:
 *   put:
 *     summary: Update user password
 *     description: Updates the user's password.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid request.
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get user details
 *     description: Retrieves user details by ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 */
