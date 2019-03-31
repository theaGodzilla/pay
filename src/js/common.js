

//时间函数，把毫秒转成xx天xx时xx分xx秒

function setTime(diffTime) {

	var sec = setDb(diffTime % 60); //秒
	var min = setDb(Math.floor(diffTime / 60) % 60); //分
	var hour = setDb(Math.floor(diffTime / 60 / 60) % 24); //小时
	var day = Math.floor(diffTime / 60 / 60 / 24);

	return { //返回多个数的时候，做成json数据
		'sec': sec,
		'min': min,
		'hour': hour,
		'day': day
	};
}

//字符串转成对象
function strToObj(str) {
	var arr = str.split('&');
	var obj = {};
	for(var i = 0; i < arr.length; i++) {
		var arr2 = arr[i].split('=');
		obj[arr2[0]] = arr2[1];
	}

	return obj;
}
//对象转成字符串
function objToStr(obj) {
	var html = '';
	for(var key in obj) {
		html += key + '=' + obj[key] + '&';
	}

	html = html.slice(0, -1);
	return html;
}

/*
 	事件监听兼容性处理：
 	参数一：节点名
 	参数二：事件名称
 	参数三：事件处理函数
 
 */

function bind(ele, type, fn) {
	if(ele.addEventListener) {
		//ie9+ 主流
		ele.addEventListener(type, fn, false);
	} else {
		//ie8-
		ele.attachEvent('on' + type, fn);
	}

}
/*
	获取样式：可以获取行内和非行内样式
	参数一：obj 节点名
	参数二：name 属性名	
 
 * */

function getstyle(obj, name) {
	//获取样式
	if(obj.currentStyle) {
		//ie8-
		return obj.currentStyle[name];
	} else {
		//主流浏览器
		return getComputedStyle(obj, false)[name];
	}
}

/*
	运动框架封装：startMove()过渡    jq animate()
	最终版：多对象，多属性，链式运动框架(运动队列)
	参数一：对象名
	参数二：属性，目标值  键名：属性名，键值：目标值    {'width':200,'heigth':400}  实现：宽度和高度一起改变，宽度变成200，高度变成400
	参数三：回调函数(可选参数)
 */

function startMove(obj, json, fnend) {

	clearInterval(obj.timer); //防止定时器叠加
	obj.timer = setInterval(function() {

		var istrue = true;

		//1.获取属性名，获取键名：属性名->初始值
		for(var key in json) {
			//			console.log(key); //width heigth opacity
			var cur = 0; //存初始值

			if(key == 'opacity') { //初始值
				cur = getstyle(obj, key) * 100; //透明度
			} else {
				cur = parseInt(getstyle(obj, key)); //width heigth borderwidth px为单位的

			}

			//2.根据初始值和目标值，进行判断确定speed方向，变形：缓冲运动
			//距离越大，速度越大,下面的公式具备方向
			var speed = (json[key] - cur) / 6;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //不要小数部分，没有这句话或晃动

			if(cur != json[key]) { //width 200 heigth 400
				istrue = false; //如果没有达到目标值，开关false
			} else {
				istrue = true; //true true
			}

			//3、运动
			if(key == 'opacity') {
				obj.style.opacity = (cur + speed) / 100;
				obj.style.filter = `alpha(opacity:${cur+speed})`;
			} else {
				obj.style[key] = cur + speed + 'px'; //针对普通属性 left  top height 
			}

		}

		//4.回调:准备一个开关,确保以上json所有的属性都已经达到目标值,才能调用这个回调函数
		if(istrue) { //如果为true,证明以上属性都达到目标值了
			clearInterval(obj.timer);
			if(fnend) {
				fnend();
			}
		}

	}, 30); //obj.timer 每个对象都有自己定时器
}

/*
 checkReg:函数可以进行表单验证
 	.trim() :去掉前后空格
 	.tel() :号码
 
 */

var checkReg = {
	trim: function(str) { //去掉前后空格
		var reg = /^\s+|\s+$/g;
		return str.replace(reg, '');
	},
	tel: function(str) { //号码
		var reg = /^1[3-9]\d{9}$/
		return reg.test(str);
	},
	email: function(str) { //邮箱正则
		var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //网上推荐
		return reg.test(str);
	},
	idcard: function(str) { //身份证
		var reg = /^(\d{17}|\d{14})[\dX]$/;
		return reg.test(str);
	},
	psweasy: function(str) { //6-18位首字母开头
		var reg = /^[a-zA-Z]\w{5,17}$/;
		return reg.test(str);
	},
	pwwagain: function(str1, str2) {
		return str1 === str2; //全等 恒等
	},
	urladr: function(str) {
		var reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
		return reg.test(str);
	},
	name:function(str){//账号字母开头,6-20位
		var reg=/^[a-zA-Z][\w\-]{5,19}$/;
		return reg.test(str);
	},
	chinese:function(str){
		var reg=/^[\u2E80-\u9FFF]+$/;
		return reg.test(str);
	}
}

/*
 	封装cookie函数:
 	存: Cookie.set()
 	取:	Cookie.get()
 	删: Cookie.remove()
 */

var Cookie={
	
	set:function(name,value,prop){//设置cookie
		//存数据到cookie里面:必写的
		var str=name+'='+value;
		
		//json存后面一些可选参数
		//expires:设置失效时间
		if(prop.expires){
			str+=';expires='+prop.expires.toUTCString();//把时间转成字符串
		}
		
		//设置path路径
		
		if(prop.path){
			//如果设置了
			str+=';path='+prop.path;
		}
		
		//domain设置可访问cookie的域名
		if(prop.domain){
			str+=';domain='+prop.domain;
		}
		
		//写到cookie
		document.cookie=str;
		
	},
	get:function(key){
		var cookies=document.cookie;//name=tiantian; age=18; usn=yuanyuan; pws=456123
		var arr=cookies.split('; ');//['name=tiantian','age=18','usn=yuanyuan','pws=456123']
		for(var i=0;i<arr.length;i++){
			var arr2=arr[i].split('=');//['name','tiantian']
			if(key==arr2[0]){
				return arr2[1];
			}
		}
	},
	remove:function(key){
		
		//删的原理:设置过期时间
		var now=new Date();
		now.setDate(now.getDate()-1);
		this.set(key,'no',{expires:now});
	}
}
/*
	ajax函数封装：要参数
		参数一：请求方式：get  post
		参数二：接口路径
		参数三：数据(可选)  name='tiantian'&psw=123456  传给后端的数据
		参数四：成功的回调函数(可选的)
 
*/
function ajax(mechod,url,data,success){
	
	//1.创建对象
	var xhr=new XMLHttpRequest();
	
	if(mechod=='GET' && data){
		//请求方式是get并且有数据
		url+='?'+data;  //var url=`api/checkname.php?username=${val}&time=${new Date()}`;
	}
	
	xhr.open(mechod,url,true);
	
	//2.发送请求
	if(mechod=='GET'){
		xhr.send();//如果是get方式，直接发送请求
	}else{
		//post方式
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);//如果是post方式，数据放在send()里面传输
	}
	//4.接收数据
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				//成功的：dom操作，数据渲染
				if(success){
					//如果有回调，就用回调
					success(xhr.responseText);//实参
				}
			}else{
				alert('出错了，状态码是：'+xhr.status);
			}
		}
	}
}