var selected = [];
var selected_count = {};
var totalPrice = 0;
var ih = "";
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
        }else if(totalPrice == 0){
            alert("請點餐");
            return;
        }else{
            $(this).getCount();
            $(this).postOrder();
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
    $("#add2Cart").click(function(){
        if($("#selDrink").text() == ""){
            alert("請選擇飲品")
            return
        }else if($("#selIH").text() == ""){
            alert("請選擇冷熱")
            return
        }
        const order = $("#selDrink").text() + "/" + $("#selIH").text();
        $("#selectedList").empty();
        selected.push(order);
        $(this).getCount();
        $(this).setCart();
    })
})

function clearSel(){
    $('#selDrink').text('');
    $('#selIH').text('');
}
$.fn.clearCart = function(){
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

$.fn.addHistory = function(datetime, data){
    const p = $("<p></p>").text(datetime+ "----"+ data);
    history.append(p);
    historyRecords[datetime]= data;
    localStorage.setItem('歷史紀錄', JSON.stringify(historyRecords));
}
$.fn.recoverHistory = function(){
    console.log("get history");
    const tempHR = localStorage.getItem("歷史紀錄");
    historyRecords = JSON.parse(tempHR);
    for(const [time, data] of Object.entries(historyRecords)){
        const p = $("<p></p>").text(time+ "----"+ data);
        history.append(p);
    }
    
}


$.fn.setCart = function(){
    totalPrice = 0;
    const drinksData = JSON.parse(localStorage.getItem('飲料'));
    for (const [drink, count] of Object.entries(selected_count)) {
        const tr = $("<tr></tr>");
        const tdDrink = $("<td></td>").text(drink);
        const tdCount = $("<td></td>").text(count);
        [drinkname, drinkIH] = drink.split("/")
        const subtotal = drinksData[drinkIH+drinkname]*count;
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
    drinkBlock.attr('onclick', 'doSelDrink(this)')
    $('#drinkList').append(drinkBlock);
}
function doSelDrink(el){ 
    $('#selDrink').text(el.innerHTML);
}
function doSelIH(el){ 
    $('#selIH').text(el.innerHTML);
}

$.fn.clearHistory = function(){
    localStorage.removeItem('歷史紀錄');
    history.empty();
}
$.fn.transDaytime = function(datetime){
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const date = datetime.getDate();
    const hour = datetime.getHours();
    const min = datetime.getMinutes();
    const time = year+"/"+month+"/"+date+"-"+hour+":"+min;
    return time;
}
