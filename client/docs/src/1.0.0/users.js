/**
 * @apiDefine public This information is publicly accessible.
 * No authentication is required.
 *
 * @apiVersion 1.0.0
 */

/**
 * @apiDefine user Authenticated access is required.
 * A session is required.
 *
 * @apiVersion 1.0.0
 */

/**
* @api {post} /user/api/register Register
* @apiVersion 1.0.0
* @apiName Register
* @apiGroup User
* @apiPermission public
*
* @apiDescription Registers a new user.
*
* @apiParam {String} username The username the user wants.
* @apiParam {String} email The email the user wants.
* @apiParam {String} password The password the user wants.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/register' -d 'email=email@domain&password=waffles'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/register' -d 'email=email@domain&password=waffles&callback=foo'
*
* @apiSuccess (200 Success) {String} message The response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Registered, please check your email to activate your account."}
*
* @apiError (400 Bad Request) MissingUsername The username is missing from the request
* @apiError (400 Bad Request) MissingEmail The email is missing from the request
* @apiError (400 Bad Request) MissingPass The password is missing form the request.
* @apiError (400 Bad Request) InvalidEmail The email provided in the request is invalid.
* @apiError (400 Bad Request) EmailExists The email provided already exists in the database.
* @apiError (400 Bad Request) UserExists The user provided already exists in the database.
* @apiError (500 Internal Server Error) ServerError There was a problem registering the user.
*
* @apiErrorExample Error-Response: (Missing Username)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing email."}
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
*     {"message":"Username already registered."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not register user."}
*/

/**
* @api {post} /api/user/login Login
* @apiVersion 1.0.0
* @apiName Login
* @apiGroup User
* @apiPermission public
*
* @apiDescription Log the user into the site.
*
* @apiParam {String} username The user's username that they used to register to the site.
* @apiParam {String} password The user's passsword they used to register to the site.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default Example:
*     curl -X POST 'https://inb4.us/api/user/login' -d 'username=mockuser&password=mockpassword'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/login' -d 'username=mockuser&password=mockpassword&callback=foo'
*
* @apiSuccess (200 Success) {String} message The specific user was logged in.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Logged in."}
*
* @apiError (400 Bad Request) MissingUsername The username was missing from the request.
* @apiError (400 Bad Request) MissingPassword The password was missing from the request.
* @apiError (400 Bad Request) UserNotExist The username does not exist in the database.
* @apiError (400 Bad Request) ActivatationNeeded You must activate your account first before you sign in.
* @apiError (400 Bad Request) PasswordMismatch The password provided was invalid.
* @apiError (500 Internal Server Error) ServerError There was a problem loggin the user in.
*
* @apiErrorExample Error-Response: (Missing Username)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing username."}
*
* @apiErrorExample Error-Response: (Missing Password)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing password."}
*
* @apiErrorExample Error-Response: (User Not Exist)
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
*     {"message":"Could not log user in."}
*/

/**
 * @api {post} /api/user/activate Activate
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiName Activate
 * @apiPermission public
 *
 * @apiDescription Activates a requested user.
 *
 * @apiParam {String} id The id of the user being requested
 * @apiParam {String} token The activation token.
 * @apiParam [callback] The name of the callback function.
 *
 * @apiExample {curl} Default example:
 *     curl -X POST 'https://inb4.us/api/user/activate' -d "id=59ea532b-e772-4764-9cad-e04b388885d3&token=91828ea8-a616-409e-b950-957259cc9e27"
 *
 * @apiExample {curl} Callback example:
 *     curl -X POST 'https://inb4.us/api/user/activate' -d "id=59ea532b-e772-4764-9cad-e04b388885d3&token=91828ea8-a616-409e-b950-957259cc9e27&callback=foo"
 *
 * @apiSuccess (200 Success) {String} message Account activated.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"Account activated."}
 *
 * @apiError (400 Bad Request) MissingId The user id was not in the request.
 * @apiError (400 Bad Request) MissingToken The token was not in the request.
 * @apiError (400 Bad Request) InvalidId The id is not a vaild ID.
 * @apiError (400 Bad Request) InvalidToken The token is not a valid token.
 * @apiError (400 Bad Request) UserNotExist The user does not exist.
 * @apiError (400 Bad Request) InvalidIdToken The token for the specified id is invalid.
 * @apiError (500 Internal Server Error) ServerError There has been an issue activating the account.
 *
 * @apiErrorExample Error-Response: (Missing ID)
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Missing user id."}
 *
 * @apiErrorExample Error-Response: (Missing Token)
 *     HTTP/1.1 400 Bad Request
 *     {"message: Missing activation token."}
 *
 * @apiErrorExample Error-Response: (Invalid Id)
 *     HTTP/1.1 400 Bad Request
 *     {"message":"Invalid user id."}
 *
 * @apiErrorExample Error-Response: (Invalid Token)
 *    HTTP/1.1 400 Bad Request
 *    {"message":"Invalid activation token."}
 *
 * @apiErrorExample Error-Response: (User Not Exist)
 *    HTTP/1.1 400 Bad Request
 *    {"message":"User does not exist."}
 *
 * @apiErrorExample Error-Response: (Invalid Id Token)
 *    HTTP/1.1 400 Bad Request
 *    {"message":"Invalid token for user."}
 *
 * @apiErrorExample Error-Response: (Activatoin Issue)
 *    HTTP/1.1 500 Internal Server Error
 *    {"message":"Could not activate account."}
 *
 */

/**
*@api {get} /api/user/logout Logout
*@apiVersion 1.0.0
*@apiName Logout
*@apiGroup User
*@apiPermission public
*
*@apiDescription Logs the user out.
*
*@apiParam {String} [callback] The name of the callback funciton.
*
*@apiExample Default example:
*     curl -X GET "https://inb4.us/api/user/logout"
*
*@apiExample Default callback example:
*     curl -X GET "https://inb4.us/api/user/logout?callback=foo"
*
*@apiSuccess (200 Success) {String} message The user has been logged out.
*
*@apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Logged out."}
*
*@apiError (500 Internal Server Error) ServerError There was a problem logging the user out.
*
*@apiErrorExample
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not log out user."}
*/
