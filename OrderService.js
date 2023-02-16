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
$.fn.getAirtbPrice = function(target_grid){
    base(target_grid).select({
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
    $('.spinner-border').show();
    var i = 0;
    base('寄杯優惠').select({
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage){
        var discountDataList=[]
        records.forEach(function(record){
            var discountData = {};
            const name = record.get('名稱');
            if(name != null){ 
                const buyCondition = parseInt(record.get('買'));
                const discount = parseInt(record.get('送'));
                const price = parseInt(record.get('價格'));
                discountData['名稱']= name;
                discountData['條件']= buyCondition;
                discountData['價格']= price;
                discountData['優惠']= discount;
                discountDataList.push(discountData)
                $(this).addDiscountElem(name);
            }
        })
        console.log(discountDataList)
        localStorage.setItem('寄杯優惠資料', JSON.stringify(discountDataList));
        $('.spinner-border').hide();
    })
}
$.fn.getDiscountRecord = function(key){
    var i = 0;
    base('寄杯紀錄').select({
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage){
        records.forEach(function(record){
            const phone_number = record.get('顧客資訊');
            if(strcmp(phone_number, key)==0){ 
                var discountRecord = {};
                const id = record.id;
                const buyCondition = record.get('寄杯優惠方案');
                var remainCount = parseInt(record.get('剩餘兌換次數'));

                discountRecord['id'] = id;
                discountRecord['顧客資訊']= phone_number;
                discountRecord['優惠方案']= buyCondition;
                discountRecord['剩餘兌換次數']= remainCount;

                console.log(discountRecord)

                $(this).setResultTable(discountRecord);
                all_records.push(discountRecord);
            }
        })
        if(all_records.length == 0){
            alert('查無資料！')
        }
        
    })
}

$.fn.updateDiscountRecord = function(new_record){
    const remainCount = new_record['剩餘兌換次數']
    const id = new_record['id']
    base('寄杯紀錄').update([
        {
          "id": id,
          "fields": {
            "剩餘兌換次數": remainCount
          }
        },
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function(record) {
          console.log(record.get('時間'));
        });
      });
}

$.fn.deleteDiscountRecord = function(target_record){
    const id = target_record['id']
    base('寄杯紀錄').destroy([id], function(err, deletedRecords) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Deleted', deletedRecords.length, 'records');
      });
}


// 帶優化：一次post上傳完成

$.fn.postOrder = function(target_grid){
    var subField = {}
    var allFields = []
    if(strcmp(target_grid, '銷售紀錄') == 0){
        const drinksData = JSON.parse(localStorage.getItem('飲料'));
        const username = $('#username').val()
        const time = $(this).transDaytime(new Date());
        const note = $('#note').val();
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
                console.log('post: ', subField);
                allFields.push(subField);
                totalOrdered+=drink;
                totalOrdered+="x"
        }
        // console.log('post: ', subField);
        // allFields.push(subField);
        // totalOrdered+=drink;
        // totalOrdered+="x"
        base(target_grid).create(allFields, function(err, records) {
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
    
    }else if(strcmp(target_grid,'寄杯紀錄') == 0){ 
        const phone_number = $('#phone_number').val()
        var discount_case = $('#discontSel').val();
        
        const price = getDiscountLocalDataByName(discount_case, '價格')
        const remainCount = getDiscountLocalDataByName(discount_case, '條件') + getDiscountLocalDataByName(discount_case, '優惠')
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
                "寄杯優惠方案": discount_case,
                "剩餘兌換次數": remainCount
            }
        }
        allFields.push(subField);
        console.log(allFields);
        base(tableName).create(allFields, function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
            }
        })
    }else if(strcmp(target_grid,'員工杯紀錄') == 0){
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
        base(target_grid).create(allFields, function(err, records) {
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