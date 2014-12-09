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
* @apiSuccessExample Success-Response: (Results Found)
*     HTTP/1.1 200 OK
*     {"message":"Results found.","results":["mockuser"]}
*
* @apiSuccessExample Success-Response: (No Results)
*     HTTP/1.1 200 OK
*     {"message":"No results.","results":[]}
*
* @apiError (400 Bad Request) MissingUsernameOrId The username or user id was missing from the request.
* @apiError (400 Bad Request) InvalidId The user id provided was not a UUID value.
* @apiError (500 Internal Server Error) ServerError There was a problem searching for the user.
*
* @apiErrorExample Error-Response: (Missing Username Or Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id or name."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not search for user."}
*
*/

/**
* @api {get} /api/search/dibs Dibs
* @apiVersion 1.0.0
* @apiName Dibs
* @apiGroup Search
* @apiPermission public
*
* @apiDescription Searches for a dib based on the name and type or the dib id.
*
* @apiParam {String} [id] The dib id to search for.
* @apiParam {String} [name] The dib name to search for.
* @apiParam {String} [type] The type of dib to search for.
* @apiParam {String} [callback] The name of the callback funciton.
*
* @apiExample Default name example:
*     curl -X GET 'https://inb4.us/api/search/dibs/thing/inb4.us'
*
* @apiExample Default id example:
*     curl -X GET 'https://inb4.us/api/search/dibs/9e3d9149-da75-4dd5-a3ef-a6013fb0df27'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/search/dibs/thing/inb4.us?callback=foo'
*
* @apiSuccess (200 Success) {String} message The successful response message.
* @apiSuccess (200 Success) {String[]} results The dib names found given the search query.
*
* @apiSuccessExample Success-Response: (Results Found)
*     HTTP/1.1 200 OK
*     {"message":"Results found.","results":["inb4.us"]}
*
* @apiSuccessExample Success-Response: (No Results)
*     HTTP/1.1 200 OK
*     {"message":"No results.","results":[]}
*
* @apiError (400 Bad Request) MissingName The dib name was missing from the request.
* @apiError (400 Bad Request) MissingType The dib type was missing from the request.
* @apiError (400 Bad Request) InvalidId The user id provided was not a UUID value.
* @apiError (400 Bad Request) InvalidType The type provided was not a "person", "place", or "thing".
* @apiError (500 Internal Server Error) ServerError There was a problem searching for the user.
*
* @apiErrorExample Error-Response: (Missing Name)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing name."}
*
* @apiErrorExample Error-Response: (Missing Type)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing type."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid type."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not search for dibs."}
*/
