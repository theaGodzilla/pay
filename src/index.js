import './js/common.js';
import './sass/base.scss';
import './sass/index.scss';



window.onload = function(){
    getRem(720,100);
    document.getElementById('history-icon').onclick=()=>{
        window.location.href='./html/PurchaseRecords.html';
    };

    var android = android || {getCredit: function() {}};

    window.data = function(num) {
        var numall = document.getElementById("int-integral");
        numall.innerHTML = num;
    }

    android.getCredit();

    async function rundata(){
        try {
            await fetch("/api/buy/products",{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json;charset=UTF-8',
                    'Authorization': '8WkjBas6a4Hk'
                }
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
            }).then(res => {
                console.log(res);
                document.getElementById('int-pay-tit').onclick=()=>{
                    // window.location.href='./html/BuySuccess.html';
                    android.pay(res.data[0].product_id);
                }
            }).catch(e => {
                console.log(e);
            })
        } catch(e) {
            console.log("error:", e);
        }
    }
    rundata();
};
window.onresize = function(){
    getRem(720,100)
};
function getRem(pwidth,prem){
    var html = document.getElementsByTagName("html")[0];
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    html.style.fontSize = oWidth/pwidth*prem + "px";
}



