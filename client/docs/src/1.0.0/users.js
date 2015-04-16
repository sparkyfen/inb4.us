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
 * @apiDefine admin Authenticated access is required.
 * An admin session is required.
 *
 * @apiVersion 1.0.0
 */

/**
* @api {post} /api/user/register Register
* @apiVersion 1.0.0
* @apiName Register
* @apiGroup User
* @apiPermission public
*
* @apiDescription Registers a new user or admin. If an admin session in provided, an admin account will be created.
*
* @apiParam {String} username The username the user wants.
* @apiParam {String} email The email the user wants.
* @apiParam {String} password The password the user wants.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/register' -d 'username=mockuser&email=mockuser@inb4.us&password=mockpassword'
*
* @apiExample Default admin example (with admin session):
*     curl -X POST 'https://inb4.us/api/user/register' -d 'username=mockadmin&email=mockadmin@inb4.us&password=mockpassword'
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/register' -d 'username=mockuser&email=mockuser@inb4.us&password=mockpassword&callback=foo'
*
* @apiSuccess (200 Success) {String} message The response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Registered, please check your email to activate your account."}
*
* @apiError (400 Bad Request) MissingUsername The username was missing from the request
* @apiError (400 Bad Request) MissingEmail The email was missing from the request
* @apiError (400 Bad Request) MissingPassword The password was missing form the request.
* @apiError (400 Bad Request) PasswordTooShort The password length was too short (must be 7 characters or greater).
* @apiError (400 Bad Request) InvalidEmail The email provided in the request is invalid.
* @apiError (400 Bad Request) EmailExists The email provided already exists in the database.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) AdminExists The username provided already exists in the admin database.
* @apiError (500 Internal Server Error) ServerError There was a problem registering the user.
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
* @apiErrorExample Error-Response: (Password Too Short)
*     HTTP/1.1 400 Bad Request
*     {"message":"Password must a minimum of 7 characters long."}
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
* @apiDescription Log the user into the site. A session with be provided upon successful sign in. If the user is an admin, an extra admin session with be provided.
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
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) AccountLocked The user account has been locked for too many login attempts.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) PasswordMismatch The password provided was invalid.
* @apiError (500 Internal Server Error) ServerError There was a problem logging the user in.
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
* @apiErrorExample Error-Response: (Account Locked)
*     HTTP/1.1 400 Bad Request
*     {"message": "Account is locked, please reset your password."}
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
*
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
 * @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
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
 * @apiError (400 Bad Request) PasswordTooShort The password length was too short (must be 7 characters or greater).
 * @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
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
 * @apiErrorExample Error-Response: (Password Too Short)
*     HTTP/1.1 400 Bad Request
*     {"message":"Password must a minimum of 7 characters long."}
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
* @apiDescription Get a specific user based on their id or username or on current user based on their session. The email returned is an md5 hash of the value and some other values from the database has been ommited.
*
* @apiParam {String} [id] The user id value of the profile requested.
* @apiParam {String} [username] The username value of the profile requested.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Session-Based example:
*     curl -X GET 'https://inb4.us/api/user'
*
* @apiExample Default id example:
*     curl -X GET 'https://inb4.us/api/user/62759d40-8f5a-47e2-b711-c3af6859c1da'
*
* @apiExample Default username example:
*     curl -X GET 'https://inb4.us/api/user/?username=mockuser'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/user/62759d40-8f5a-47e2-b711-c3af6859c1da/?callback=foo'
*
* @apiSuccess (200 Success) user The user object.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*    { "_id": "62759d40-8f5a-47e2-b711-c3af6859c1da","username": "mockuser","firstname": "","lastname": "","email": "0c6de13ccb6398e67c34bfd9e8b7d284","dibs": [],"address":{"streetAddress": null,"unitAddress": null,"city": null,"state": null,"country": "United States","zipcode": null},"friends":[],"admin":false}
*
* @apiError (400 Bad Request) MissingUsername The user name was missing in the request.
* @apiError (400 Bad Request) InvalidId The user id was not a UUID value.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
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
* @apiErrorExample Error-Response: (OneOrMoreFriendsDoesNotExist)
*     HTTP/1.1 400 Bad Request
*     {"message":"One or more friends do no exist."}
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
*     {"message":"Profile updated."}
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
*     {"message":"Profile deleted."}
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
*     {"message":"Password reset."}
*
* @apiError (400 Bad Request) MissingId The user id was missing from the request.
* @apiError (400 Bad Request) MissingToken The reset token was missing from the request.
* @apiError (400 Bad Request) MissingNewPassword The new password was missing from the request.
* @apiError (400 Bad Request) MissingConfirmPassword The confirm password was missing from the request.
* @apiError (400 Bad Request) PasswordMismatch The new and confirm password were not the same.
* @apiError (400 Bad Request) PasswordTooShort The password length was too short (must be 7 characters or greater).
* @apiError (400 Bad Request) InvalidId The user id was not a UUID value.
* @apiError (400 Bad Request) InvalidToken The reset token was not a UUID value.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
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
* @apiErrorExample Error-Response: (Password Too Short)
*     HTTP/1.1 400 Bad Request
*     {"message":"Password must a minimum of 7 characters long."}
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

/**
* @api {post} /api/user/address Edit Address
* @apiVersion 1.0.0
* @apiName Edit Address
* @apiGroup User
* @apiPermission user
*
* @apiDescription Edit the user address
*
* @apiParam {String} streetAddress The street address of the user.
* @apiParam {String} [unitAddress] The unit address of the user.
* @apiParam {String} city The city of the user.
* @apiParam {String} state The state of the user.
* @apiParam {String} zipcode The zipcode of the user.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/address' -d "streetAddress=1234%20E.%20Melon%20Rd.&city=Tempe&state=AZ&zipcode=85251"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/address' -d "streetAddress=1234%20E.%20Melon%20Rd.&city=Tempe&state=AZ&zipcode=85251&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Address updated."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingStreetAddress The street address was missing from the request.
* @apiError (400 Bad Request) MissingCity The city was missing from the request.
* @apiError (400 Bad Request) MissingState The state was missing from the request.
* @apiError (400 Bad Request) MissingZipcode The zipcode was missing from the request.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem editing the user address.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Street Address)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing street address."}
*
* @apiErrorExample Error-Response: (Missing City)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing city."}
*
* @apiErrorExample Error-Response: (Missing State)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing state."}
*
* @apiErrorExample Error-Response: (Missing Zipcode)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing zipcode."}
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
*     {"message":"Could not edit the address."}
*/

/**
* @api {post} /api/user/friends Add Friend
* @apiVersion 1.0.0
* @apiName Add Friend
* @apiGroup User
* @apiPermission user
*
* @apiDescription Add a friend to your friends list. If a friends request has been made for that friend on their end, this will accept their friendship.
*
* @apiParam {String} username Your friends username.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/friends' -d "username=mockfriend"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/friends' -d "username=mockfriend&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Friend added."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingUsername Your friend's username was missing from the request.
* @apiError (400 Bad Request) CannotFriendYourself Your friends username was your own.
* @apiError (400 Bad Request) UserFriendNotExist Your friends username and yours do not exist in the database.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) FriendNotExist Your friends username does not exist in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) FriendActivationNeeded Your friend must activate their account first before you can add them as a friend.
* @apiError (500 Internal Server Error) ServerError There was a problem adding your new friend.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Username)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing friend name."}
*
* @apiErrorExample Error-Response: (Cannot Friend Yourself)
*     HTTP/1.1 400 Bad Request
*     {"message":"Cannot add yourself as a friend."}
*
* @apiErrorExample Error-Response: (User Friend Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User and friend do not exist."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Friend Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Friend does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Friend Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"Your friend must activate their account before adding them."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not add friend."}
*/

/**
* @api {get} /api/user/friends Get Friends
* @apiVersion 1.0.0
* @apiName Get Friends
* @apiGroup User
* @apiPermission public
*
* @apiDescription Get friends based on the username.
*
* @apiParam {String} [username] The username to get their friends.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default session example:
*     curl -X GET 'https://inb4.us/api/user/friends'
*
* @apiExample Default username example:
*     curl -X GET 'https://inb4.us/api/user/friends?username=mockuser'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/user/friends' -d "callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
* @apiSuccess (200 Success) {String[]} results The usernames of your friends.
*
* @apiSuccessExample Success-Response: (Results Found)
*     HTTP/1.1 200 OK
*     {"message":"Results found.", results: [{"id":"df67be53-9f73-4d6b-bcd9-2d9091354549","username":"mockfriend","03151b5d34743419c4786164b27d6314","firstname":"","lastname":""}]}
*
* @apiSuccessExample Success-Response: (No Results)
*     HTTP/1.1 200 OK
*     {"message":"No results.", results: []}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem adding your new friend.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
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
*     {"message":"Could not get friends."}
*/

/**
* @api {post} /api/user/friends/delete Delete Friend
* @apiVersion 1.0.0
* @apiName Delete Friend
* @apiGroup User
* @apiPermission user
*
* @apiDescription Delete a friend to your friends list.
*
* @apiParam {String} id Your friends id.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/friends/delete' -d "id=3fa2d253-7794-4b36-8c98-7886efb9473f"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/friends/delete' -d "id=3fa2d253-7794-4b36-8c98-7886efb9473f&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Friend deleted."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingId Your friend's user id was missing from the request.
* @apiError (400 Bad Request) InvalidId Your friend's user id was not a UUID value.
* @apiError (400 Bad Request) UserNoFriends The user does not any friends to delete.
* @apiError (400 Bad Request) UserNotExist The user does not exist in the database.
* @apiError (400 Bad Request) FriendNotExistForUser The user does not have the requested id in their friends list.
* @apiError (400 Bad Request) FriendNotExist Your friends username does not exist in the database.
* @apiError (400 Bad Request) UserNotExistForFriend The friend does not have the user id requesting the delete in their friends list.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem deleting your friend.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (User No Friends)
*     HTTP/1.1 400 Bad Request
*     {"message":"User has no friends to delete."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Friend Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Friend does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Friend Not Exist For User)
*     HTTP/1.1 400 Bad Request
*     {"message":"Friend does not exist for user."}
*
* @apiErrorExample Error-Response: (User Not Exist For Friend)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist for friend."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not delete friend."}
*/

/**
* @api {post} /api/user/purge Purge Accounts
* @apiVersion 1.0.0
* @apiName Purge Accounts
* @apiGroup User
* @apiPermission admin
*
* @apiDescription Purge all inactive accounts that haven't been activated after the purge time in the config file.
*
* @apiParam {Number} datetime The date time to compare against.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/purge' -d "datetime=1418149552680"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/purge' -d "datetime=1418149552680&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
* @apiSuccess (200 Success) {Object[]} results The list of users that got purged.
* @apiSuccess (200 Success) {String} results.id The user id that got purged.
* @apiSuccess (200 Success) {String} results.username The username that got purged.
*
* @apiSuccessExample Success-Response (Results Found):
*     HTTP/1.1 200 OK
*     {"message":"Accounts purged.", "results": [{"id": "ca683876-e79c-4660-b203-e0ac0df67bc1","username": "mockuser"}]}
*
* @apiSuccessExample Success-Response (No Results):
*     HTTP/1.1 200 OK
*     {"message":"No accounts to purge.", "results": []}
*
* @apiError (401 Unauthorized) UnauthorizedAdmin The admin did not sign in.
* @apiError (401 Unauthorized) UnauthorizedUser The user attempting to use this page is not an admin.
* @apiError (400 Bad Request) InvalidDatetime The date time was not an integer value.
* @apiError (500 Internal Server Error) ServerError There was a problem purging the inactive accounts.
*
* @apiErrorExample Error-Response: (Unauthorized Admin)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Unauthorized User)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Admins only."}
*
* @apiErrorExample Error-Response: (Invalid Datetime)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid datetime."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not purge inactive accounts."}
*/

/**
* @api {get} /api/user/check Check Session
* @apiVersion 1.0.0
* @apiName Check Session
* @apiGroup User
* @apiPermission public
*
* @apiDescription Checks the current user session if there is one to see if its valid.
*
* @apiParam {Boolean} [admin] Whether the session checked should be an admin or not.
* @apiParam {String} [callback] The name of the callback funciton.
*
* @apiExample Default example:
*     curl -X GET 'https://inb4.us/api/user/check'
*
* @apiExample Default admin example:
*     curl -X GET 'https://inb4.us/api/user/check?admin=true'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/user/check?callback=foo'
*
* @apiSuccess (200 Success) {String} message The user has been logged out.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Valid session."}
*
* @apiError (401 Unauthorized) UnauthorizedAdmin The admin or user did not sign in.
* @apiError (401 Unauthorized) UnauthorizedUser The user attempting to use this page is not an admin.
*
* @apiErrorExample Error-Response: (Unauthorized Admin)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Unauthorized User)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Admins only."}
*
*/

/**
* @api {post} /api/user/resend Resend Activation Email
* @apiVersion 1.0.0
* @apiName Resend Activation Email
* @apiGroup User
* @apiPermission public
*
* @apiDescription Resends an activation email for a user to activate their account.
*
* @apiParam {String} email The email address associated with the account.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/user/resend' -d "email=mockuser@inb4.us"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/user/resend' -d "email=mockuser@inb4.us&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response (Results Found):
*     HTTP/1.1 200 OK
*     {"message":"Activation email sent."}
*
* @apiError (400 Bad Request) MissingEmail The email was missing from the request
* @apiError (400 Bad Request) InvalidEmail The email provided in the request is invalid.
* @apiError (400 Bad Request) EmailNotExist The email provided in the request was not associated with any user in the database.
* @apiError (400 Bad Request) UserAlreadyActive The username associated with the email is already activated.
* @apiError (400 Bad Request) AccountLocked The user account has been locked for too many login attempts.
* @apiError (500 Internal Server Error) ServerError There was a problem resending the activation email.
*
* @apiErrorExample Error-Response: (Missing Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing email."}
*
* @apiErrorExample Error-Response: (Invalid Email)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid email."}
*
* @apiErrorExample Error-Response: (Email Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Email is not registered."}
*
* @apiErrorExample Error-Response: (User Already Active)
*     HTTP/1.1 400 Bad Request
*     {"message":"User is already active."}
*
* @apiErrorExample Error-Response: (Account Locked)
*     HTTP/1.1 400 Bad Request
*     {"message": "Account is locked, please reset your password."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not resend activation email."}
*
*/