const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');

$.fn.getAirtbData = function(){
    $('#loader').show();
    base('銷售紀錄').select({
        maxRecords: 20,
        view: "Grid view",
        sort: [{field: "時間", direction: "desc"}]
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            var time = record.get('時間')
            var date = record.get('日期')
            var drink = record.get('飲品')
            var IH = record.get('冷熱')
            var count = record.get('數量')
            var price = record.get('金額')
            var user = record.get('登記人')
            var note = record.get('備註')
            var subData = {'時間': time, '飲品': drink, '冷熱': IH, '數量': count, '金額': price, '登記人': user, '備註': note};
            const now = new Date();
            var [year, month, day] = date.split('/')
            if(now.getMonth()+ 1 == parseInt(month) &&  now.getDate() == parseInt(day) ){
                $(this).addRecordElem(subData);
            }
        });
        fetchNextPage();
        $('#loader').hide();

    }, function done(err) {
        if (err) { 
            console.error(err); 
            const error = $('<h3></h3>').text('伺服器錯誤')
            $('body').append(error);
            return; 
        }
    });
}

// GET 飲品、售價 並從在localStorage
$.fn.getAirtbPrice = function(){
    base('售價').select({
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
        localStorage.setItem('飲料', JSON.stringify(allDrinkData));
        $(".spinner-border").hide();
    })

}
$.fn.getDiscountData = function(){
    var i = 0;
    base('寄杯優惠').select({
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage){
        var discountData = {};
        records.forEach(function(record){
            const name = record.get('名稱');
            if(name != null){ 
                const buyCondition = parseInt(record.get('買'));
                const discount = parseInt(record.get('送'));
                discountData['名稱']= name;
                discountData['條件']= buyCondition;
                discountData['優惠']= discount;
                console.log(name)
                $(this).addDiscountElem(name, i);
            }
        })
        console.log(discountData)
        localStorage.setItem('寄杯優惠資料', JSON.stringify(discountData));
    })
}


// 帶優化：一次post上傳完成

$.fn.postOrder = function(tableName){
    if(strcmp(tableName, '銷售紀錄') == 0){
        const drinksData = JSON.parse(localStorage.getItem('飲料'));
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
        }
        console.log('post: ', subField);
        allFields.push(subField);
        totalOrdered= totalOrdered.concat(drink);
        totalOrdered= totalOrdered.concat("x", count)
        base(tableName).create(allFields, function(err, records) {
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
    
    }else if(strcmp(tableName,'寄杯紀錄') == 0){ 
        const phone_number = $('#phone_number').val()
        var discount_case = $('#discontSel').val();
        const price = localStorage.getItem('寄杯優惠資料')[discount_case]
        const username = $('#username').val()
        const time = $(this).transDaytime(new Date());
        const note = $('#note').val();
        subField = {
            "fields" : {
                "時間": time,
                "備註": note,
                "金額": price,
                "登記人": username,
                "顧客資訊": phone_number,
                "寄杯優惠方案": discount_case
            }
        }
        allFields.push(subField);
        base(tableName).create(allFields, function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
            }
        })
    }
        
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
function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}