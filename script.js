var selected = [];
var selected_count = {};
var totalPrice = 0;
var ih = "";
var historyRecords = {};
var selDrink = ''
var selIH = ''

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
            $(this).refreshSelectedlist();
            var text = "最終確認\n";
            for (const [drink, count] of Object.entries(selected_count)) {
                text += drink + " " + count + "杯\n"
            }
            text += "Total: "+ totalPrice;
            if(confirm(text) == true){
                $(this).postOrder('銷售紀錄');
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
$.fn.refreshSelectedlist = function(){
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
    const drinksData = JSON.parse(localStorage.getItem('飲料'));
    for (const [drink, count] of Object.entries(selected_count)) {
        const tr = $("<tr></tr>");
        const tdDrink = $("<td></td>").text(drink);
        const tdCount = $("<td></td>").text(count);
        [drinkname, drinkIH] = drink.split("/")
        const subtotal = drinksData[drinkIH+drinkname]*count;
        const tdSubtotal = $("<td></td>").text(subtotal);
        const delOrderBtn = $("<button></button>").text(' - ');
        delOrderBtn.attr('id', drink);
        delOrderBtn.attr('onclick', 'del1Order(this)');
        delOrderBtn.attr('class', 'btn btn-danger')
        const delOrder = $("<td></td>").append(delOrderBtn);
        tr.append(tdDrink, tdCount, tdSubtotal, delOrder);
        $("#selectedList").append(tr);

        totalPrice+= subtotal;
    }
    $("#total").text(totalPrice);
}
$.fn.addDrinkElem = function(drinkname){
    const table = $('<table></table>').attr('class', 'drink-block')
    const tr1 = $('<tr></tr>')
    const tdname = $('<td></td>').attr('rowspan', '2').text(drinkname)
    const tdice = $('<td>冰</td>').attr('class', 'ice')
    tdice.attr('id', drinkname)
    tdice.attr('onclick', 'doSelDrink(this)')
    tr1.append(tdname, tdice)
    
    const tr2 = $('<tr></tr>')
    const tdhot = $('<td>熱</td>').attr('class', 'hot')
    tdhot.attr('id', drinkname)
    tdhot.attr('onclick', 'doSelDrink(this)')
    tr2.append(tdhot)
    table.append(tr1, tr2)
    // const drinkBlock = $('<button></button>').text(drinkname);
    // drinkBlock.attr('class', 'drink-block btn btn-dark')
    // drinkBlock.attr('onclick', 'doSelDrink(this)')
    $('#drinkList').append(table);
}

function doSelDrink(el){ 
    const order = el.id + "/" + el.innerHTML;
    $("#selectedList").empty();
    selected.push(order);
    $(this).refreshSelectedlist();
    $(this).setCart();
}


$.fn.clearHistory = function(){
    localStorage.removeItem('歷史紀錄');
    history.empty();
}
function del1Order(el){ 
    const drinkname = el.id;

    for(var i = 0; i<selected.length; i++){ 
        const item = selected[i];
        if(strcmp(item, drinkname)==0){
            selected.splice(i, 1);
            break; //循環終止
        }
    }
    $("#selectedList").empty();
    $(this).refreshSelectedlist();
    $(this).setCart();
    console.log(selected);
}

function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}