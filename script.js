var selected = [];
var selected_count = {};
var totalPrice = 0;

const history = $("#records");

$(document).ready(function(){
    // $(this).getAirtbData();
    $(this).getAirtbPrice();

    //點餐動作
    $(".drink-block").click(function(){
        $("#selectedList").empty();
        selected.push($(this).text());
        $(this).getCount();
        for (const [drink, count] of Object.entries(selected_count)) {
            const tr = $("<tr></tr>");
            const tdDrink = $("<td></td>").text(drink);
            const tdCount = $("<td></td>").text(count);
            const subtotal = localStorage.getItem(drink)*count;
            const tdSubtotal = $("<td></td>").text(subtotal);
            tr.append(tdDrink, tdCount, tdSubtotal);
            $("#selectedList").append(tr);

            totalPrice+= subtotal;
            $("#total").text(totalPrice);
        }
    })
    $("#clear").click(function(){
        $(this).clear();
    })
    $("#submit").click(function(){
        if($("#username").val() == ""){
            alert("請輸入使用者");
            return;
        }else{
            $(this).doSubmit();
            $(this).clear();
        }
        
    })
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
    localStorage.setItem(time, data);
}

$.fn.setDrinkList = function(){

}