## Water Oil Project API Reference



## 1. Login

#### POST /login

#### Request body: 

```
username: string
password: string
```

#### Response body:

```json
{'status': 0, 'msg': 'Login successful.'}
```

```json
{'status': 1, 'msg': 'Account does not exist.'}
```

```json
{'status': 2, 'msg': 'Password and username do not match.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 2. Register

#### POST /register

#### Request body: 

```
username: string
password: string
email: string
name: string
```

#### Response body:

```json
{'status': 0, 'msg': 'Register successful.'}
```

```json
{'status': 3, 'msg': 'Username has been used.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 3. Reset Password

#### POST /resetpassword

#### Request body: 

```
username: string
password: string
email: string
```

#### Response body:

```json
{'status': 0, 'msg': 'New password has been set successfully.'}
```

```json
{'status': 1, 'msg': 'Username does not exist.'}
```

```json
{'status': 2, 'msg': 'Email address does not match.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 4. Image Upload

#### POST /photoupload

#### Request body: 

```
gps: string
photo: file/image*
notes: string
```

```
gps sample: (No parenthesis, blank space. Latitude FIRST.)
38.8897,-77.0089
```

* If no notes inputted by user, set notes to "" with the request.
* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

#### Response body:

```json
{'status': 0, 'msg': 'Upload successful.'}
```

```json
{'status': 2, 'msg': 'KeyError. Please upload correct image.'}
```

```json
{'status': 4, 'msg': 'Image is not uploaded.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 6, 'msg': 'Please upload only image file.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 5. History

#### GET /history

* This function is used for ordinary users. Only history from this user will be returned.
* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

#### Response body:

```json
{'status': 0, 'msg': {1: {'id': 2534, 'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}, 2: {{'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}}}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 6. Admin - Login

#### POST /adminlogin

#### Request body: 

```
username: string
password: string
```

#### Response body:

```json
{'status': 0, 'msg': 'Login successful.'}
```

```json
{'status': 1, 'msg': 'Account does not exist.'}
```

```json
{'status': 2, 'msg': 'Password and username do not match.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 7, 'msg': 'You are not allowed to login as administrator.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 7. Admin - Photo List

#### POST /adminphotolist

#### Request body: 

```
mindate: string
maxdate: string
```

* Time format: 2021-11-30

* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

* All dates on the server side and response part are UTC.

* If all photos needed, set parameters both as "-" with the request.

#### Response body:

```json
{'status': 0, 'msg': {1: {'id': 135345, 'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}, 2: {{'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}}}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 8. User meta

#### GET /user

#### Response body:

```json
{'status': 0, 'msg': {'username': 'aasdf', 'name': 'Todd Jastin', 'email': '123@abc.com'}}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 9. Admin - Update photo information(notes&tags)

#### POST /adminupdatephotoinfo

#### Request body: 

```
photo_id: number
notes: string
tags: string
```

```json
*tags format:
#tag1#tag2#tag3
```

* Notes and tags should be whole values rather than only updated parts!

* If only notes(or tags) should be updated, please also pass current tags(or notes) together with the request.

#### Response body:

```json
{'status': 0, 'msg': 'Update successful.'}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 10. Logout

#### GET /logout

#### Response body:

```json
{'status': 0, 'msg': 'Logout successful.'}
```



## 11. Admin - Search Filter - Tag

#### POST /searchfiltertag

#### Request body: 

```
taglist: string
```

```json
*taglist format:
#tag1#tag2#tag3
```

* A list with photos contain all tags at the same time will be returned.
* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

#### Response body:

```json
{'status': 0, 'msg': {1: {'id': 135345, 'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}, 2: {{'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}}}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 12. Admin - Search Filter - Notes Global (filter photos with specific query string in their notes)
#### POST /searchfilterglobal

#### Request body: 

```
querystring: string
```

* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

#### Response body:

```json
{'status': 0, 'msg': {1: {'id': 135345, 'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}, 2: {{'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}}}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```



## 13. Admin - Search Filter - geography
#### POST /searchfiltergeography

#### Request body: 

```
gps: string
radius: number
radiusunit: string
```

```json
gps sample: (No parenthesis, blank space. Latitude FIRST.)
38.8897,-77.0089
```

* Radiusunit should be "m" (meter), "km" or "mile".
* Radius should be an integer.
* GPS should be decimal degrees. https://en.wikipedia.org/wiki/Decimal_degrees (38° 53′ 23″ N, 77° 00′ 32″ W) ==> (38.8897,-77.0089)

#### Response body:

```json
{'status': 0, 'msg': {1: {'id': 135345, 'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}, 2: {{'path': '123', 'gps': '30.354, 175.945', 'date': '20211212', 'result': 13.7, 'notes': 'note here.', 'tags': '#tag1#tag2#tag3'}}}
```

```json
{'status': 5, 'msg': 'Please fill in all required fields.'}
```

```json
{'status': 8, 'msg': 'Login timeout.'}
```

```json
{'status': 9, 'msg': 'Error occurred, please try again later.'}
```
