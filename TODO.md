# Grunt TODO


## client/app/add/add.controller.js

-  **TODO** `(line 19)`  Show notification if success.
-  **TODO** `(line 22)`  Show notification on error.

## client/app/app.js

-  **TODO** `(line 39)`  Show unauthorized notification.
-  **TODO** `(line 43)`  Show error notification.

## client/app/dibs/dibs.controller.js

-  **TODO** `(line 9)`  Show notification when there is an error.

## client/app/dibs/edit/edit.controller.js

-  **TODO** `(line 10)`  Show notification when there is an error.
-  **TODO** `(line 25)`  Show notification if we successfully edit the dib.
-  **TODO** `(line 29)`  Show notification when there is an error.
-  **TODO** `(line 40)`  Show notification if we successfully delete the dib.
-  **TODO** `(line 44)`  Show notification when there is an error.

## client/app/user/activate/activate.controller.js

-  **TODO** `(line 14)`  Show notification upon success.
-  **TODO** `(line 21)`  Show notification if there is an error.

## client/app/user/edit/edit.controller.js

-  **TODO** `(line 8)`  Show error notification on get user request.
-  **TODO** `(line 19)`  Show success notificiation on edit user request.
-  **TODO** `(line 22)`  Show error notification on edit user request.
-  **TODO** `(line 30)`  Show success notification on change password request.
-  **TODO** `(line 33)`  Show error notification on change password request.
-  **TODO** `(line 38)`  Write delete user function call.

## client/app/user/friends/friends.controller.js

-  **TODO** `(line 7)`  Show error notification on get friend error.

## client/app/user/reset/reset.controller.js

-  **TODO** `(line 15)`  Show notification upon success.
-  **TODO** `(line 23)`  Show notification if there is an error.

## client/app/user/user.controller.js

-  **TODO** `(line 8)`  Show error notification on failed user request.
-  **TODO** `(line 17)`  Show success notification on successful friend request.
-  **TODO** `(line 19)`  Show error notification on failed friend request.
-  **TODO** `(line 37)`  Show success notification on successful friend request.
-  **TODO** `(line 39)`  Show error notification on failed friend request.

## client/components/navbar/navbar.controller.js

-  **TODO** `(line 22)`  Show success notification on successful logout.
-  **TODO** `(line 28)`  Show error notification on failed logout.
-  **TODO** `(line 45)`  Show success notification on successful login.
-  **TODO** `(line 50)`  Show error notification on failed login.
-  **TODO** `(line 75)`  Show success notification on successful registration.
-  **TODO** `(line 79)`  Show error notification on failed registration.

## server/api/dibs/addDibs.controller.js

-  **TODO** `(line 39)`  If we want someone to add more data in this request, we can offer it and update this to include that data.

## server/api/dibs/edit/edit.controller.js

-  **TODO** `(line 16)`  We can do some more validation on checking for "similar" keywords here, example: "foobar" and "FooBar" are similar.
-  **TODO** `(line 17)`  Allow image links other than Imgur and upload them.

## server/api/dibs/report/report.controller.js

-  **TODO** `(line 22)`  Sanitize reason report.

## server/api/search/users/users.controller.js

-  **TODO** `(line 28)`  If we want more data on the users, we can update the usernames list with these values.
-  **TODO** `(line 46)`  If we want more data on the users, we can update the usernames list with these values.

## server/api/user/delete/delete.spec.js

-  **TODO** `(line 17)`  Update delete user tests to account for when a user has dibs and make sure that runs properly.
-  **TODO** `(line 18)`  Update delete user tests to account for when a user has friends and make sure that runs properly as well.
