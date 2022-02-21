var selected = [];
var selected_count = {};



$(document).ready(function(){
    $(".drink-block").click(function(){
        $("#selectedList").empty();
        selected.push($(this).text());
        $(this).getCount();
        for (const [drink, count] of Object.entries(selected_count)) {
            const tr = $("<tr></tr>");
            const tdDrink = $("<td></td>").text(drink);
            const tdCount = $("<td></td>").text(count);
            tr.append(tdDrink, tdCount);
            $("#selectedList").append(tr);
        }

        
    })
    $("#clear").click(function(){
        selected = []
        console.log("clear");
        alert("清除");
        $("#selectedList").empty();
    })
})

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