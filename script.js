var selected = [];
var selected_count = {};
var totalPrice = 0;
var historyRecords = {};

const history = $("#records");

$(document).ready(function(){
    // $(this).getAirtbData();
    $(this).getAirtbPrice('售價');
    console.log("submit");
    $("#submit").click(function(){
        console.log("submit");
        if($("#username").val() == ""){
            alert("請輸入登記者姓名");
            return;
        }else if(totalPrice == 0){
            alert("請點餐");
            return;
        }else{
            var text = "最終確認\n";
            for (const [drink, count] of Object.entries(selected_count)) {
                text += drink + " " + count + "杯\n"
            }
            text += "Total: "+ totalPrice;
            if(confirm(text) == true){
                $(this).refreshSelectedlist();
                $(this).postOrder('銷售紀錄');
                $(this).clearCart()
            }
        }
    })
    $("#clearCart").click(function(){
        $(this).clearCart();
    })
    if(localStorage.getItem("歷史紀錄")!== null){
        $(this).recoverHistory();
    }

    $("#clHistory").click(function(){
        if(confirm("確定要清除下列的所有紀錄嗎？")){
            $(this).clearHistory();
        } 
    })
})
