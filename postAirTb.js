var selected = [];
var selected_count = {};



$(document).ready(function(){
    $(this).getData();
    $("#submit").click(function(){
        var username = $('#username').val()
        const date = new Date();
        $(this).getCount()
        var text = "最終確認\n";
        for (const [drink, count] of Object.entries(selected_count)) {
            text += drink + " " + count + "杯\n"
        }
        if(confirm(text) == true){
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
                    alert("登記失敗")
                    return;
                    }
                    records.forEach(function (record) {
                    console.log(record.getId());
                    });
                });
            }
            alert("完成登記")
            $("#selectedList").empty();
        }
        
    })
    
})