/**
 * @apiDefine admin Authenticated access is required.
 * An admin session is required.
 *
 * @apiVersion 1.0.0
 */

/**
* @api {post} /admin/api/register Register
* @apiVersion 1.0.0
* @apiName Register
* @apiGroup Admin
* @apiPermission admin
*
* @apiDescription Registers a new admin. Only admins can create admin acocunts.
*
* @apiParam {String} username The username the admin wants.
* @apiParam {String} email The email the admin wants.
* @apiParam {String} password The password the admin wants.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/admin/register' -d 'email=mockadmin@inb4.us&password=mockpassword'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/admin/register' -d 'email=mockadmin@inb4.us&password=mockpassword&callback=foo'
*
* @apiSuccess (200 Success) {String} message The response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Registered, please check your email to activate your account."}
*
* @apiError (401 Unauthorized) UnauthorizedAdmin The admin did not sign in.
* @apiError (401 Unauthorized) UnauthorizedUser The user attempting to use this page is not an admin.
* @apiError (400 Bad Request) MissingUsername The username was missing from the request
* @apiError (400 Bad Request) MissingEmail The email was missing from the request
* @apiError (400 Bad Request) MissingPass The password was missing form the request.
* @apiError (400 Bad Request) InvalidEmail The email provided in the request is invalid.
* @apiError (400 Bad Request) EmailExists The email provided already exists in the database.
* @apiError (400 Bad Request) UserExists The username provided already exists in the user database.
* @apiError (400 Bad Request) AdminExists The username provided already exists in the admin database.
* @apiError (500 Internal Server Error) ServerError There was a problem registering the admin.
*
* @apiErrorExample Error-Response: (Unauthorized Admin)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Unauthorized User)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Admins only."}
*
* @apiErrorExample Error-Response: (Missing Username)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing username."}
*
* @apiErrorExample Error-Response: (Missing Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing email."}
*
* @apiErrorExample Error-Response: (Missing Password)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing password."}
*
* @apiErrorExample Error-Response: (Invalid Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid email."}
*
* @apiErrorExample Error-Response: (Email Exists)
*     HTTP/1.1 400 Bad Request
*     {"message":"Email already registered."}
*
* @apiErrorExample Error-Response: (User Exists)
*     HTTP/1.1 400 Bad Request
*     {"message":"User already registered with that username."}
*
* @apiErrorExample Error-Response: (Admin Exists)
*     HTTP/1.1 400 Bad Request
*     {"message":"Admin already registered with that username."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not register admin."}
*/

/**
* @api {post} /api/admin/login Login
* @apiVersion 1.0.0
* @apiName Login
* @apiGroup Admin
* @apiPermission public
*
* @apiDescription Log the admin into the site.
*
* @apiParam {String} username The admin's username that they used to register to the site.
* @apiParam {String} password The admin's passsword they used to register to the site.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default Example:
*     curl -X POST 'https://inb4.us/api/admin/login' -d 'username=mockadmin&password=mockpassword'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/admin/login' -d 'username=mockadmin&password=mockpassword&callback=foo'
*
* @apiSuccess (200 Success) {String} message The specific admin was logged in.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Logged in."}
*
* @apiError (400 Bad Request) MissingUsername The username was missing from the request.
* @apiError (400 Bad Request) MissingPassword The password was missing from the request.
* @apiError (400 Bad Request)AdminNotExist The username does not exist in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) PasswordMismatch The password provided was invalid.
* @apiError (500 Internal Server Error) ServerError There was a problem logging the admin in.
*
* @apiErrorExample Error-Response: (Missing Username)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing username."}
*
* @apiErrorExample Error-Response: (Missing Password)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing password."}
*
* @apiErrorExample Error-Response: (Admin Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Username does not exist."}
*
* @apiErrorExample Error-Response: (Activatation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before signing in."}
*
* @apiErrorExample Error-Response: (Password Mismatch)
*     HTTP/1.1 400 Bad Request
*     {"message":"Passwords do not match."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not log admin in."}
*/