/**
* @api {post} /api/dibs Add Dib
* @apiVersion 1.0.0
* @apiName Add Dib
* @apiGroup Dib
* @apiPermission user
*
* @apiDescription Adds a new dib to the database.
*
* @apiParam {String} name The name of the dib.
* @apiParam {String} description The description of the dib.
* @apiParam {String} type The type of dib it is (person, place, or thing).
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default example:
*     curl -X POST 'https://inb4.us/api/dibs' -d "name=inb4.us&description=My%20Website&type=thing"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/dibs' -d "name=inb4.us&description=My%20Website&type=thing&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"messsage":"Dib called!"}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingName The dib name was missing from the request.
* @apiError (400 Bad Request) MissingDescription The dib description was missing from the request.
* @apiError (400 Bad Request) MissingType The dib type was missing from the request.
* @apiError (400 Bad Request) InvalidType The dib type was not "person", "place" or "thing".
* @apiError (400 Bad Request) UserNotExist The email that was requested could not be found tied to a user in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first before you sign in.
* @apiError (500 Internal Server Error) ServerError There was a problem adding the new dib.
*
* @apiErrorExample Error-Response: (Unauthorized)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Name)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing name."}
*
* @apiErrorExample Error-Response: (Missing Description)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing description."}
*
* @apiErrorExample Error-Response: (Missing Type)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing type."}
*
* @apiErrorExample Error-Response: (Invalid Type)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid type."}
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
*     {"message":"Could not add new dibs."}
*/