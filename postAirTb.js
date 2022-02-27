// 帶優化：一次post上傳完成

$.fn.doSubmit = function(){
    var text = "最終確認\n";
    for (const [drink, count] of Object.entries(selected_count)) {
        text += drink + " " + count + "杯\n"
    }
    text += "Total: "+ totalPrice;
    if(confirm(text) == true){
        const drinksData = JSON.parse(localStorage.getItem('飲料'));
        const username = $('#username').val()
        const time = new Date();
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
                    "金額": drinksData[drinkname]*count,
                    "備註": note,
                    "登記人": username
                }
            }
            console.log(subField);
            allFields.push(subField);
            totalOrdered= totalOrdered.concat(drink);
            totalOrdered= totalOrdered.concat("x", count)
        }
        base('銷售紀錄').create(allFields, function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
            }
            records.forEach(function (record) {
                console.log(record.getId());
            });
        });
        
        const data = totalOrdered +" : 總共 $"+ totalPrice;
        $(this).addHistory(time, data);
        $(this).clear();
    }
}
