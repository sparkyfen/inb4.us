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
* @apiError (400 Bad Request) MissingUsername The username was missing from the request
* @apiError (400 Bad Request) MissingEmail The email was missing from the request
* @apiError (400 Bad Request) MissingPass The password was missing form the request.
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
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
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
 * @apiErrorExample Error-Response: (Activation Issue)
 *    HTTP/1.1 500 Internal Server Error
 *    {"message":"Could not activate account."}
 *
 */

/**
* @api {get} /api/user/logout Logout
* @apiVersion 1.0.0
* @apiName Logout
* @apiGroup User
* @apiPermission public
*
* @apiDescription Logs the user out.
*
* @apiParam {String} [callback] The name of the callback funciton.
*
* @apiExample Default example:
*     curl -X GET 'https://inb4.us/api/user/logout'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/user/logout?callback=foo'
*
* @apiSuccess (200 Success) {String} message The user has been logged out.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Logged out."}
*
* @apiError (500 Internal Server Error) ServerError There was a problem logging the user out.
*
* @apiErrorExample
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not log out user."}
*/

/**
 * @api {post} /api/user/change Change Password
 * @apiVersion 1.0.0
 * @apiName Change Password
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Change the user's password given the old password, new password, and confirmation.
 *
 * @apiParam {String} old The user's old password.
 * @apiParam {String} new The user's new password.
 * @apiParam {String} confirm The user's new password retyped to confirm they set it correctly.
 * @apiParam {String} [callback] The name of the callback function.
 *
 * @apiExample {curl} Default example:
 *      curl -X POST 'https://inb4.us/api/user/change' -d "old=mockpassword&new=newmockpassword&confirm=newmockpassword"
 *
 * @apiExample {curl} Callback example:
 *      curl -X POST 'https://inb4.us/api/user/change' -d "old=mockpassword&new=newmockpassword&confirm=newmockpassword&callback=foo"
 *
 * @apiSuccess (200 Success) {String} message The password has been updated.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Password changed, please log in again."}
 *
 * @apiError (401 Unauthorized) Unauthorized The user did not sign in.
 * @apiError (400 Bad Request) MissingOldPassword The old password was not in the request.
 * @apiError (400 Bad Request) MissingNewPassword The new password was not in the request.
 * @apiError (400 Bad Request) MissingConfirmPassword The new confirm password was not in the request.
 * @apiError (400 Bad Request) PasswordMismatch The new and confirm passwords were not the same.
 * @apiError (400 Bad Request) UserNotExist The user does not exist.
 * @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
 * @apiError (400 Bad Request) HashMismatch The old password did not match what the database has.
 * @apiError (500 Internal Server Error) ServerError There was a problem changing the password.
 *
 * @apiErrorExample Error-Response: (Unauthorized)
 *      HTTP/1.1 401 Unauthorized
 *      {"message": "Please sign in."}
 *
 * @apiErrorExample Error-Response: (Missing Old Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing old password."}
 *
 * @apiErrorExample Error-Response: (Missing New Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing new password."}
 *
 * @apiErrorExample Error-Response: (Missing Confirm Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing confirm new password."}
 *
 * @apiErrorExample Error-Response: (Password Mismatch)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "New passwords do not match."}
 *
 * @apiErrorExample Error-Response: (User Not Exist)
 *    HTTP/1.1 400 Bad Request
 *    {"message":"User does not exist."}
 *
 * @apiErrorExample Error-Response: (Activatation Needed)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "You must activate this account before using it."}
 *
 * @apiErrorExample Error-Response: (Hash Mismatch)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Passwords do not match."}
 *
 * @apiErrorExample Error-Response: (Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not change password for user."}
 *
 */

/**
* @api {post} /api/user/lost Lost Password
* @apiVersion 1.0.0
* @apiName Lost Password
* @apiGroup User
* @apiPermission public
*
* @apiDescription Reset the user password given an email address.
*
* @apiParam {String} email The email of account associated with the user account..
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/lost' -d "email=mockuser@inb4.us"
*
* @apiExample Example with callback:
*     curl -X POST 'https://inb4.us/api/user/lost' -d "email=mockuser@inb4.us&callback=foo"
*
* @apiSuccess (200 Success) {String} message The reset email has been sent to user.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Reset email sent."}
*
* @apiError (400 Bad Request) MissingEmail The email was missing from the request.
* @apiError (400 Bad Request) InvalidEmail The email was invalid.
* @apiError (400 Bad Request) UserNotExist The email that was requested could not be found tied to a user in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem resetting the user password.
*
* @apiErrorExample Error-Response: (Missing Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing email."}
*
* @apiErrorExample Error-Response: (Invalid Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid email."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not send lost password email."}
*
*/

/**
* @api {get} /api/user Get Profile
* @apiVersion 1.0.0
* @apiName Get Profile
* @apiGroup User
* @apiPermission user
*
* @apiDescription Get a specific user based on their id or on current user based on their session.
*
* @apiParam {String} [id] The user id value of the profile requested.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Session-Based example:
*     curl -X GET 'https://inb4.us/api/user'
*
* @apiExample Default example:
*     curl -X GET 'https://inb4.us/api/user/62759d40-8f5a-47e2-b711-c3af6859c1da'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/user/62759d40-8f5a-47e2-b711-c3af6859c1da/?callback=foo'
*
* @apiSuccess (200 Success) user The user object.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*    { "_id": "62759d40-8f5a-47e2-b711-c3af6859c1da","username": "mockuser","firstname": "","lastname": "","email": "mockuser@inb4.us","dibs": [],"address":{"streetAddress": null,"unitAddress": null,"city": null,"state": null,"country": "United States","zipcode": null}}
*
* @apiError (400 Bad Request) MissingId The user id was missing from the session.
* @apiError (400 Bad Request) UserNotExist The email that was requested could not be found tied to a user in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem getting the user profile.
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing user id."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not get user profile."}
*/

/**
* @api {post} /api/user Update Profile
* @apiVersion 1.0.0
* @apiName Update Profile
* @apiGroup User
* @apiPermission user
*
* @apiDescription Updates the user profile that is logged in.
*
* @apiParam {String} email The user email for updating the profile.
* @apiParam {String} [firstName] The user's first name for updating the profile.
* @apiParam {String} [lastName] The user's last name for updating the profile.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user' -d "email=mockuser@inb4.us&firstName=mock&lastName=user"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user' -d "email=mockuser@inb4.us&firstName=mock&lastName=user&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"messsage":"Profile updated."}
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Profile updated, please reactivate your account."}
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Nothing to change for profile."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingEmail The email was missing from the request.
* @apiError (400 Bad Request) InvalidEmail The email specified in the request is invalid.
* @apiError (400 Bad Request) UserNotExist The email that was requested could not be found tied to a user in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem updating the user profile.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing email."}
*
* @apiErrorExample Error-Response: (Invalid Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid email."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not update user profile."}
*/


/**
* @api {post} /api/user/delete Delete Profile
* @apiVersion 1.0.0
* @apiName Delete Profile
* @apiGroup User
* @apiPermission user
*
* @apiDescription Deletes the user profile.
*
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/delete'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/delete' -d "callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"messsage":"Profile deleted."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (500 Internal Server Error) ServerError There was a problem deleting the user profile.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not delete user profile."}
*/

/**
* @api {post} /api/user/reset Reset Password
* @apiVersion 1.0.0
* @apiName Reset Password
* @apiGroup User
* @apiPermission public
*
* @apiDescription Reset the user password given the token and new passwords.
*
* @apiParam {String} id The user id.
* @apiParam {String} token The reset token.
* @apiParam {String} new The new password.
* @apiParam {String} confirm The confirmed new password.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/reset' -d "id=2f24954f-edea-425c-aaf3-b1e421a2ce08&token=c4b98f80-9c7a-4660-9edb-cc1472ba0cc1&new=newmockpassword&confirm=newmockpassword"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/reset' -d "id=2f24954f-edea-425c-aaf3-b1e421a2ce08&token=c4b98f80-9c7a-4660-9edb-cc1472ba0cc1&new=newmockpassword&confirm=newmockpassword&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"messsage":"Password reset."}
*
* @apiError (400 Bad Request) MissingId The user id was missing from the request.
* @apiError (400 Bad Request) MissingToken The reset token was missing from the request.
* @apiError (400 Bad Request) MissingNewPassword The new password was missing from the request.
* @apiError (400 Bad Request) MissingConfirmPassword The confirm password was missing from the request.
* @apiError (400 Bad Request) PasswordMismatch The new and confirm password were not the same.
* @apiError (400 Bad Request) InvalidId The user id was not a UUID value.
* @apiError (400 Bad Request) InvalidToken The reset token was not a UUID value.
* @apiError (400 Bad Request) UserNotExist The email that was requested could not be found tied to a user in the database.
* @apiError (400 Bad Request) TokenNotForUser The reset token was not issued for this user.
* @apiError (400 Bad Request) InvalidTokenForUser The token in the request did not match the token in the database.
* @apiError (500 Internal Server Error) ServerError There was a problem resetting the user password.
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing user id."}
*
* @apiErrorExample Error-Response: (Missing Token)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing reset token."}
*
* @apiErrorExample Error-Response: (Missing New Password)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing new password."}
*
* @apiErrorExample Error-Response: (Missing Confirm Password)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing confirmed password."}
*
* @apiErrorExample Error-Response: (Password Mismatch)
*     HTTP/1.1 400 Bad Request
*     {"message":"New passwords do not match."}
*
* @apiErrorExample Error-Response: (Invalid id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid user id."}
*
* @apiErrorExample Error-Response: (Invalid Token)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid reset token."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Token Not For User)
*     HTTP/1.1 400 Bad Request
*     {"message":"A reset token was not issued for this user."}
*
* @apiErrorExample Error-Response: (Invalid Token For User)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid token for requested id."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not reset user password."}
*/
