
/*
 *   
 * 與AirtableService.js&script.js 十分相近
 * 差別在獲取資料的table
 * 售價table：1102員工杯售價
 * 紀錄table：1102員工杯紀錄
 * 
 */


const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');


// GET 飲品、售價 並從在localStorage
$.fn.getAirtbPrice = function(){
    base('員工杯售價').select({
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage){
        var allDrinkData = {};
        records.forEach(function(record){
            const drinkName = record.get('品項');
            const drinkPriceH = parseInt(record.get('價格/熱'));
            const drinkPriceI = parseInt(record.get('價格/冰'));
            console.log("售價(熱)：" + drinkName , drinkPriceH);
            console.log("售價(冷)：" + drinkName , drinkPriceI);
            allDrinkData['熱' + drinkName]= drinkPriceH;
            allDrinkData['冰'+drinkName]= drinkPriceI;
            $(this).addDrinkElem(drinkName);
        })
        localStorage.setItem('員工杯飲料', JSON.stringify(allDrinkData));
        $(".spinner-border").hide();
    })

}

// 帶優化：一次post上傳完成

$.fn.postOrder = function(){
    var text = "最終確認\n";
    for (const [drink, count] of Object.entries(selected_count)) {
        text += drink + " " + count + "杯\n"
    }
    text += "Total: "+ totalPrice;
    if(confirm(text) == true){
        const drinksData = JSON.parse(localStorage.getItem('員工杯飲料'));
        const username = $('#username').val()
        const time = $(this).transDaytime(new Date());
        const note = $('#note').val();
        var subField = {}
        var allFields = []
        var totalOrdered = "";
        for (const [drink, count] of Object.entries(selected_count)) {
            
            [drinkname, drinkT] = drink.split("/");
            subField = {
                "fields" : {
                    "時間": time,
                    "飲品": drinkname,
                    "冷熱": drinkT,
                    "數量": count,
                    "金額": drinksData[drinkT+drinkname]*count,
                    "備註": note,
                    "登記人": username
                }
            }
            console.log(subField);
            allFields.push(subField);
            totalOrdered= totalOrdered.concat(drink);
            totalOrdered= totalOrdered.concat("x", count)
        }
        base('員工杯紀錄').create(allFields, function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
            }
            $(this).clearOrder();
            records.forEach(function (record) {
                console.log(record.getId());
              });
        });
        const data = totalOrdered +" : 總共 $"+ totalPrice;
        $(this).addHistory(time, data);
        
    }
}

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
        }else if(selected_count == null){
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

    const input = $('<input type="checkbox" data-toggle="toggle"></input>')
    const p = $("<p></p>").text(datetime+ "----"+ data);
    p.append(input)
    history.append(p);
    historyRecords[datetime]= data;
    localStorage.setItem('歷史紀錄', JSON.stringify(historyRecords));
}
$.fn.recoverHistory = function(){
    console.log("get history");
    const tempHR = localStorage.getItem("歷史紀錄");
    historyRecords = JSON.parse(tempHR);
    for(const [time, data] of Object.entries(historyRecords)){
        const input = $('<input type="checkbox"  data-toggle="toggle"></input>')
        const p = $("<p></p>").text(time+ "----"+ data);
        p.append(input)
        history.append(p);
    }
    
}


$.fn.setCart = function(){
    totalPrice = 0;
    const drinksData = JSON.parse(localStorage.getItem('員工杯飲料'));
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
