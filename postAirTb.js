$.fn.doSubmit = function(){
    var username = $('#username').val()
    const date = new Date();
    const note = $('#note').val()
    
    $(this).getCount()
    var text = "最終確認\n";
    for (const [drink, count] of Object.entries(selected_count)) {
        text += drink + " " + count + "杯\n"
    }
    text += "Total: "+ totalPrice;
    if(confirm(text) == true){
        for (const [drink, count] of Object.entries(selected_count)) {
            base('銷售紀錄').create([
            {
                "fields": {
                    "時間": date,
                    "飲品": drink,
                    "數量": count,
                    "金額": localStorage.getItem(drink)*count,
                    "備註": note,
                    "登記人": username
                }
                }
            ], function(err, records) {
                if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
                }
                records.forEach(function (record) {
                console.log(record.getId());
                });
            });
            const data = drink + "x" + count
            $(this).setHistory(date, data);
        }
        
    }
}