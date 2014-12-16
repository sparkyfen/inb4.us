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
* @apiParam {String} type The type of dib it is (person, place, or thing).
* @apiParam {String} description The description of the dib.
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
*     {"message":"Dib called!"}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingName The dib name was missing from the request.
* @apiError (400 Bad Request) MissingType The dib type was missing from the request.
* @apiError (400 Bad Request) MissingDescription The dib description was missing from the request.
* @apiError (400 Bad Request) InvalidType The dib type was not "person", "place" or "thing".
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (500 Internal Server Error) ServerError There was a problem adding the new dib.
*
* @apiErrorExample Error-Response: (Unauthorized)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Name)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing name."}
*
* @apiErrorExample Error-Response: (Missing Type)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing type."}
*
* @apiErrorExample Error-Response: (Missing Description)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing description."}
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

/**
* @api {get} /api/dibs Get Dib
* @apiVersion 1.0.0
* @apiName Get Dib
* @apiGroup Dib
* @apiPermission public
*
* @apiDescription Gets a dib from the database.
*
* @apiParam {String} id The dib id.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -X GET 'https://inb4.us/api/dibs/ecb42657-0283-4887-b368-49fe99d14617'
*
* @apiExample Default callback example:
*     curl -X GET 'https://inb4.us/api/dibs/ecb42657-0283-4887-b368-49fe99d14617?callback=foo'
*
* @apiSuccess (200 Success) {Object} dib The dib object.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"_id":"3cb1126e-80ee-4d26-897b-f0f5016ad590","name":"inb4.us","description":"My website!","type":"thing","image":null,"url":null,"keywords":[],"creator":"volvox","dates":{"created":1417250723705,"edited":null},"reports":[],"badges":[],"viewers":0,"active":true}
*
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) NoReportsExist The reports tied to the dib are not in the database.
* @apiError (400 Bad Request) OneOrMoreReportersMissing One or more of the reporters tied to the dib are not in the database.
* @apiError (500 Internal Server Error) ServerError There was a problem getting the dib.
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (No Reports Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"No reporters exist."}
*
* @apiErrorExample Error-Response: (One Or More Reporters Missing)
*     HTTP/1.1 400 Bad Request
*     {"message":"One or more reporters do not exist."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not get dib."}
*/

/**
* @api {post} /api/dibs/edit Edit Dib
* @apiVersion 1.0.0
* @apiName Edit Dib
* @apiGroup Dib
* @apiPermission user
*
* @apiDescription Edits an existing dib in the database.
*
* @apiParam {String} id The dib id.
* @apiParam {String} [description] The description of the dib.
* @apiParam {String} [image] The dib image.
* @apiParam {String} [url] The url that provides more information about the dib.
* @apiParam {String[]} [keywords] The keywords that help identify the dib.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -H 'Content-Type: application/json' -X POST 'https://inb4.us/api/dibs/edit' -d '{"id": "3cb1126e-80ee-4d26-897b-f0f5016ad590","keywords": ["website","dibs","inb4"],"image": "http://i.imgur.com/Tghu1Wj.png","url": "https://inb4.us"}'
*
* @apiExample Default callback example:
*     curl -H 'Content-Type: application/json' -X POST 'https://inb4.us/api/dibs/edit' -d '{"id": "3cb1126e-80ee-4d26-897b-f0f5016ad590","keywords": ["website","dibs","inb4"],"image": "http://i.imgur.com/Tghu1Wj.png","url": "https://inb4.us", "callback": "foo"}'
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Dib edited."}
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Nothing to change for dib."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) InvalidImage The dib image url was not an valid URL.
* @apiError (400 Bad Request) InvalidImgurLink The dib image url not an Imgur Link.
* @apiError (400 Bad Request) InvalidURL The dib url was not an valid URL.
* @apiError (400 Bad Request) KeywordsNotList The keywords value was not a list.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (400 Bad Request) DibNotActive The dib requested was not active.
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) UserNotAllowed The user signed in cannot edit this dib.
* @apiError (500 Internal Server Error) ServerError There was a problem editing the dib.
*
* @apiErrorExample Error-Response: (Unauthorized)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (Invalid Image)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid image."}
*
* @apiErrorExample Error-Response: (Invalid Imgur Link)
*     HTTP/1.1 400 Bad Request
*     {"message":"Image must be an Imgur link."}
*
* @apiErrorExample Error-Response: (Invalid URL)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid URL."}
*
* @apiErrorExample Error-Response: (Keywords Not List)
*     HTTP/1.1 400 Bad Request
*     {"message":"Keywords must be a list."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
* @apiErrorExample Error-Response: (Dib Not Active)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib is not active, please reactivate it before editing."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (User Not Allowed)
*     HTTP/1.1 400 Bad Request
*     {"message":"User cannot edit this dib."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not edit dib."}
*/

/**
* @api {post} /api/dibs/delete Delete Dib
* @apiVersion 1.0.0
* @apiName Delete Dib
* @apiGroup Dib
* @apiPermission user
*
* @apiDescription Delete a dib from the database if you created it or if you're an admin.
*
* @apiParam {String} id The dib id.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -X POST 'https://inb4.us/api/dibs/delete' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/dibs/delete' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Dib deleted."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) UserNoDibs The user does not have any dibs to delete.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (400 Bad Request) DeletionUnauthorized The current user is not allowed to delete the dib.
* @apiError (500 Internal Server Error) ServerError There was a problem deleting the dib.
*
* @apiErrorExample Error-Response: (Unauthorized)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (User No Dibs)
*     HTTP/1.1 400 Bad Request
*     {"message":"User has no dibs."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
* @apiErrorExample Error-Response: (Deletion Unauthorized)
*     HTTP/1.1 400 Bad Request
*     {"message":"You are not allowed to delete this dib."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not add new dibs."}
*/

/**
* @api {post} /api/dibs/report Report Dib
* @apiVersion 1.0.0
* @apiName Report Dib
* @apiGroup Dib
* @apiPermission user
*
* @apiDescription Report a dib for inappropriate content or any reason.
*
* @apiParam {String} id The dib id.
* @apiParam {String} reason The reason the dib is being reported.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -X POST 'https://inb4.us/api/dibs/report' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590&reason=Because%20it%20is%20inappropriate."
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/dibs/report' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590&reason=Because%20it%20is%20inappropriate.&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Dib reported."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) MissingReason The report reason was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (400 Bad Request) DibNotActive The dib requested was not active.
* @apiError (400 Bad Request) CannotReportOwnDib The dib being reported is owned by you and you cannot report your own dib.
* @apiError (400 Bad Request) AlreadyReportedDib The dib being reported has already been reported by you.
* @apiError (500 Internal Server Error) ServerError There was a problem reporting the dib.
*
* @apiErrorExample Error-Response: (Unauthorized)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Missing Reason)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing reason."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
*  @apiErrorExample Error-Response: (Dib Not Active)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib is not active, please reactivate it before editing."}
*
*  @apiErrorExample Error-Response: (Cannot Report Own Dib)
*     HTTP/1.1 400 Bad Request
*     {"message":"You cannot report your own dib, please delete it instead."}
*
*  @apiErrorExample Error-Response: (Already Reported Dib)
*     HTTP/1.1 400 Bad Request
*     {"message":"You have already reported this dib."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not report dib."}
*/

/**
* @api {post} /api/dibs/deactivate Deactivate Dib
* @apiVersion 1.0.0
* @apiName Deactive Dib
* @apiGroup Dib
* @apiPermission admin
*
* @apiDescription Deactivate a dib.
*
* @apiParam {String} id The dib id.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -X POST 'https://inb4.us/api/dibs/deactivate' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/dibs/deactivate' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Dib deactivated."}
*
* @apiError (401 Unauthorized) UnauthorizedAdmin The admin did not sign in.
* @apiError (401 Unauthorized) UnauthorizedUser The user attempting to use this page is not an admin.
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) AdminNotExist The username based on the session was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (500 Internal Server Error) ServerError There was a problem deactivating the dib.
*
* @apiErrorExample Error-Response: (Unauthorized Admin)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Unauthorized User)
*      HTTP/1.1 401 Unauthorized
*      {"message": "Admins only."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (Admin Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Admin does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not deactivate dib."}
*/

/**
* @api {post} /api/dibs/reset Reset Dib View Count
* @apiVersion 1.0.0
* @apiName Reset Dib View Count
* @apiGroup Dib
* @apiPermission user
*
* @apiDescription Reset the dib view count if you created it or if you're an admin.
*
* @apiParam {String} id The dib id.
* @apiParam {String} [callback] The name of the callback function.
*
* @apiExample Default id example:
*     curl -X POST 'https://inb4.us/api/dibs/delete' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590"
*
* @apiExample Default callback example:
*     curl -X POST 'https://inb4.us/api/dibs/delete' -d "id=3cb1126e-80ee-4d26-897b-f0f5016ad590&callback=foo"
*
* @apiSuccess (200 Success) {String} message The successful response message.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message":"Dib view count reset."}
*
* @apiError (401 Unauthorized) Unauthorized The user did not sign in.
* @apiError (400 Bad Request) MissingId The dib id was not in the request.
* @apiError (400 Bad Request) InvalidId The dib id was not a UUID value.
* @apiError (400 Bad Request) DibNotExist The dib requested was not in the database.
* @apiError (400 Bad Request) UserNotExist The username tied to the dib was not in the database.
* @apiError (400 Bad Request) ActivationNeeded You must activate your account first beforehand.
* @apiError (400 Bad Request) DeletionUnauthorized The current user is not allowed to delete the dib.
* @apiError (500 Internal Server Error) ServerError There was a problem resetting the dib view count.
*
* @apiErrorExample Error-Response: (Unauthorized)
*     HTTP/1.1 401 Unauthorized
*     {"message": "Please sign in."}
*
* @apiErrorExample Error-Response: (Missing Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Missing id."}
*
* @apiErrorExample Error-Response: (Invalid Id)
*     HTTP/1.1 400 Bad Request
*     {"message":"Invalid id."}
*
* @apiErrorExample Error-Response: (User Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"User does not exist."}
*
* @apiErrorExample Error-Response: (Activation Needed)
*     HTTP/1.1 400 Bad Request
*     {"message":"You must activate this account before using it."}
*
* @apiErrorExample Error-Response: (Dib Not Exist)
*     HTTP/1.1 400 Bad Request
*     {"message":"Dib does not exist."}
*
* @apiErrorExample Error-Response: (Deletion Unauthorized)
*     HTTP/1.1 400 Bad Request
*     {"message":"You are not allowed to delete this dib."}
*
* @apiErrorExample Error-Response: (Server Error)
*     HTTP/1.1 500 Internal Server Error
*     {"message":"Could not reset dib view count."}
*/