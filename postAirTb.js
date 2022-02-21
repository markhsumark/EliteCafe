var selected = [];
var selected_count = {};



$(document).ready(function(){
    $("#submit").click(function(){
        alert("you have clicked the button")
        var username = $('#username').val()
        const date = new Date();
        $(this).myFunctionName()
        for (const [drink, count] of Object.entries(selected_count)) {
            base('銷售紀錄').create([
            {
                "fields": {
                    "時間": date,
                    "飲品": drink,
                    "數量": count,
                    "金額": 80,
                    "備註": "無\n",
                    "登記人": username
                }
                }
            ], function(err, records) {
                if (err) {
                console.error(err);
                return;
                }
                records.forEach(function (record) {
                console.log(record.getId());
                });
            });
        }
        
    })
    $(".drink-block").click(function(){
        selected.push($(this).text());
        console.log(selected);
    })
    $("#clear").click(function(){
        selected = []
        console.log("clear");
        alert("清除");
    })
})

$.fn.myFunctionName = function(){
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