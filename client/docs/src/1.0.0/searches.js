/**
* @api {get} /api/search/users Users
* @apiVersion 1.0.0
* @apiName Users
* @apiGroup Search
* @apiPermission public
*
* @apiDescription Searches for a user based on their username or user id.
*
* @apiParam {String} [id] The user id to search for.
* @apiParam {String} [username] The username to search for.
* @apiParam {String} [callback] The name of the callback funciton.
*
* @apiExample Default name example:
*     curl -X GET 'https://inb4.us/api/search/users/mockuser'
*
* @apiExample Default id example:
*     curl -X GET 'https://inb4.us/api/search/users/ccadf505-dd59-48d4-90f7-a948709717fc'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/search/users/mockuser?callback=foo'
*
* @apiSuccess (200 Success) {String} message The successful response message.
* @apiSuccess (200 Success) {String[]} results The usernames found given the search query.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Results found.","results":["mockuser"]}
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"No results.","results":[]}
*
* @apiError (400 Bad Request) MissingUsernameOrId The username or user id was missing from the request.
* @apiError (400 Bad Request) InvalidId The user id provided was not a UUID value.
* @apiError (500 Internal Server Error) ServerError There was a problem searching for the user.
*
* @apiErrorExample
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not search for user."}
*/