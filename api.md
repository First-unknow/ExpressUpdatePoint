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
  * **Code:** 404 NOT FOUND 
