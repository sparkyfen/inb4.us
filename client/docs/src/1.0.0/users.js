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
* @apiErrorExample Error-Response: (Problem)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not register user."}
*/