const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');

$.fn.getAirtbData = function(){
    base('銷售紀錄').select({
        maxRecords: 20,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            var time = record.get('時間')
            var drink = record.get('飲品')
            var IH = record.get('冷熱')
            var count = record.get('數量')
            var price = record.get('金額')
            var user = record.get('登記人')
            var note = record.get('備註')
            var subData = {'時間': time, '飲品': drink, '冷熱': IH, '數量': count, '金額': price, '登記人': user, '備註': note};
            console.log(subData);
            $(this).addRecordElem(subData);
        });
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
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
            const drinkPrice = parseInt(record.get('價格'));
            console.log("售價：" + drinkName , drinkPrice);
            allDrinkData[drinkName]= drinkPrice;
            $(this).addDrinkElem(drinkName);
        })
        localStorage.setItem('飲料', JSON.stringify(allDrinkData));
        $(".spinner-border").hide();
    })

}

