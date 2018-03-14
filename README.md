z-simple-request
---
#### Install
        npm install z-simple-request --save

#### Example

```js
    const {request} =require('z-simple-request');
    const req=request('www.google.com',true);
    req({
      method:'get',
      path:'/'
    })
    .then(result=>console.log(result))
    .catch(err=>console.log(err))
```

 API
===
#### request


request(`hostname`,`isHttps`,`opts`):`req`
- opts
    - `port`  Set initial port of remote server (default 80 | 443)
    - `cookie` Cookie
    
#### req
 req(`opts`,`headers`):`Promise`
 
 - opts
    - `method` Http method
    - `path` 
    - `body` Request PayLoad
    - `port?` Specify a port to override the initial port
    - `hostname?` Specify a hostname to override
 - headers  
      >Request http headers
 
####  Advanced Example:
 ```js
const {request}=require('z-simple-request');
const cookie='account=aa';
const req=request('www.xxxx.com',true,{cookie});
req({
  method:'post',
  path:'/submitForm',
  body:{content:'content'}
}).then(....);

//specify a apecial cookie:

const childCookie='account=cc; age=20';

req(
  {
      method:'post',
      path:'/submitForm',
      body:{content:'content'}
  },
  {   
      Cookie:childCookie,
      selfHeader:'xxx'
  }
).then(...);

 ```
 
 