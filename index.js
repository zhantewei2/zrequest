const https=require('https');
const http=require('http');

const request=(hostname,isHttps,port,Cookie)=>{
	const _http=isHttps?https:http;
	const opts={
		hostname:hostname,
		port:port||isHttps?443:80,
	};
	if(isHttps)opts.rejectUnauthorized=false;
	const baseHeaders={
		'Content-Type':'application/json',
		'Cookie':Cookie||''	
	}

	return (selfOpts,headers={})=>new Promise((resolve,reject)=>{
		try{
			let _headers={};
			selfOpts.method=selfOpts.method.toUpperCase();
			if(selfOpts.body){
				selfOpts.body=JSON.stringify(selfOpts.body);
				_headers['Content-Length']=Buffer.byteLength(selfOpts.body);
			}
			selfOpts.headers=Object.assign(_headers,baseHeaders,headers)
	 		const req=_http.request(Object.assign({},opts,selfOpts),res=>{
	 			let dataBuf=Buffer.from([]);
	 			res.on('data',chunk=>dataBuf=Buffer.concat([dataBuf,chunk]));
	 			res.on('end',()=>resolve(dataBuf.toString()));
	 			res.on('err',err=>reject(err));
	 		})
	 		req.on('err',e=>reject(err));
	 		selfOpts.body&&req.write(selfOpts.body);
	 		req.end();
 		}catch(e){
 			reject(e);
 		}
	})
}
const cookieString=cookieObj=>{
	let str='';
	for(let i in cookieObj){
		str+=i+'='+cookieObj[i]+'; '
	}
	return str.slice(0,-2);
}


module.exports.request=request;
module.exports.cookieStingify=cookieString;