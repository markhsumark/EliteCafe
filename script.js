var selected = [];
var selected_count = {};
var totalPrice = 0;
var ih = "熱";
var historyRecords = {};

const history = $("#records");

$(document).ready(function(){
    // $(this).getAirtbData();
    $(this).getAirtbPrice();
    console.log("submit");
    $("#submit").click(function(){
        console.log("submit");
        if($("#username").val() == ""){
            alert("請輸入登記者姓名");
            return;
        }else{
            $(this).getCount();
            $(this).doSubmit();
            $(this).clear();
        }
    })
    $("#clear").click(function(){
        $(this).clear();
    })
    if(localStorage.getItem("歷史紀錄")!== null){
        $(this).getHistory();
    }

    
})
$.fn.clear = function(){
    selected = []
    selected_count = {};
    totalPrice = 0;
    $("#total").text('0');
    $("#selectedList").empty();
    console.log("clear");
}
$.fn.getCount = function(){
    selected_count = selected.reduce((obj,item)=>{
    if (item in obj) {
        obj[item]++
    } else {
        obj[item] = 1
    }
    return obj
    },{})
    console.log(selected_count)
}

$.fn.setHistory = function(datetime, data){
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const date = datetime.getDate();
    const hour = datetime.getHours();
    const min = datetime.getMinutes();
    const sec = datetime.getSeconds();
    const time = year+"/"+month+"/"+date+"-"+hour+":"+min+":"+sec;
    const p = $("<p></p>").text(time+ "----"+ data);
    history.append(p);
    historyRecords[time]= data;
    localStorage.setItem('歷史紀錄', JSON.stringify(historyRecords));
}
$.fn.getHistory = function(){
    console.log("get history");
    const tempHR = localStorage.getItem("歷史紀錄");
    historyRecords = JSON.parse(tempHR);
    for(const [time, data] of Object.entries(historyRecords)){
        const p = $("<p></p>").text(time+ "----"+ data);
        history.append(p);
    }
    
}

//點餐動作
function order(drink){
    const drinkname = drink.innerHTML;
    $("#selectedList").empty();
    totalPrice = 0;
    selected.push(drinkname);
    $(this).getCount();
    $(this).setCart();
}
function changeIH(IH){
    ih = IH.innerHTML;
    $("#ihShow").text(ih);
    console.log("change IH to "+ ih);
}
$.fn.setCart = function(){
    const drinksData = JSON.parse(localStorage.getItem('飲料'));
    for (const [drink, count] of Object.entries(selected_count)) {
        const tr = $("<tr></tr>");
        const tdDrink = $("<td></td>").text(drink);
        const tdCount = $("<td></td>").text(count);
        const subtotal = drinksData[drink]*count;
        const tdSubtotal = $("<td></td>").text(subtotal);
        tr.append(tdDrink, tdCount, tdSubtotal);
        $("#selectedList").append(tr);

        totalPrice+= subtotal;
        $("#total").text(totalPrice);
    }
}
$.fn.addDrinkElem = function(drinkname){
    const drinkBlock = $('<button></button>').text(drinkname);
    drinkBlock.attr('class', 'drink-block btn btn-dark')
    drinkBlock.attr('onclick', 'order(this)');
    $('#drinkList').append(drinkBlock);
}
