import '../sass/base.scss';
// import './adapter.js';
import '../sass/BuySuccess.scss';

window.onload = function(){
    getRem(720,100);
    document.getElementById('call-btn').onclick=()=>{
        window.location.href='../html/PurchaseFailed.html';
    };
};
function getRem(pwidth,prem){
    var html = document.getElementsByTagName("html")[0];
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    html.style.fontSize = oWidth/pwidth*prem + "px";
}