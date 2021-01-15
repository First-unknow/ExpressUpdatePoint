# EXPRESS UPDATE POINT
## Install dependencies
if use yarn
```
$ yarn install 
```
if use npm
```
$ npm install
```


## Develop environment at localhost:7000
if use yarn
```
$ yarn start
```
if use npm
```
$ npm run start
```
# API

## Update Point

` https://${url}/updatePoint`

> ### Request Body

```
  {
    "memberId": "",
    "productCode": "",
    "terminalId": "",
    "volumn": "",
    "price": ""
  }
```
<br />

> ### Method

    POST

> ### Success Response
<br />

 * **Code:** 202 ACCEPTED <br />
  * **Content:** 
```
  {
    "memberId": "",
    "productName": "",
    "receivePoint": number 
  }
```
<br />

> ### Error Response
  * **Code:** 400 Bad Request
  * **Code:** 403 Forbidden
  * **Code:** 404 NOT FOUND 



