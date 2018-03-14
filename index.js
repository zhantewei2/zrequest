const https=require('https');
const http=require('http');
const {URL} =require('url');





const request=(hostname,isHttps,params={})=>{
	const _http=isHttps?https:http;
	let {cookie,port,redirection=true}=params;


	const opts={
		hostname:hostname,
		port:port||(isHttps?443:80),
	};
	if(isHttps)opts.rejectUnauthorized=false;
	const baseHeaders={
		'Content-Type':'application/json',
		'Cookie':cookie||''	
	}

	const nextReq=(selfOpts,headers={})=>new Promise((resolve,reject)=>{
		try{
			let _headers={};
			selfOpts.method=selfOpts.method.toUpperCase();
			if(selfOpts.body){
				selfOpts.body=JSON.stringify(selfOpts.body);
				_headers['Content-Length']=Buffer.byteLength(selfOpts.body);
			}
			selfOpts.headers=Object.assign(_headers,baseHeaders,headers);

	 		const req=_http.request(Object.assign({},opts,selfOpts),res=>{

	 			if(res.headers.location&&redirection){
	 				const h=new URL(res.headers.location);
	 				headers['Referer']=(isHttps?'https':'http')+'://'+hostname+selfOpts.path;
	 				selfOpts.path=h.pathname;
	 				selfOpts.hostname=h.hostname;

	 				return nextReq(selfOpts,headers).then(result=>resolve(result)).catch(err=>reject(err));
	 			}
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
	return nextReq;
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