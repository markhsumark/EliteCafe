$(document).ready(function() {
    $(this).getAirtbData();
})


$.fn.addRecordElem = function(record){
    var tr = $('<tr></tr>');

    const td1 = $('<td></td>').text(record['時間']);
    const td2 = $('<td></td>').text(record['飲品']);
    const td3 = $('<td></td>').text(record['冷熱']);
    const td4 = $('<td></td>').text(record['數量']);
    const td5 = $('<td></td>').text(record['金額']);
    const td6 = $('<td></td>').text(record['登記人']);
    const td7 = $('<td></td>').text(record['備註']);
    tr.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(td7);
    $('#records').append(tr);

}
$.fn.transDaytime = function(datetime){
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const date = datetime.getDate();
    const hour = datetime.getHours();
    const min = datetime.getMinutes();
    const sec = datetime.getSeconds();
    const daytime = year+"/"+month+"/"+date+"\n"+hour+":"+min+":"+sec;
    return daytime;
}

const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');

$.fn.getAirtbData = function(){
    $('#loader').show();
    base('1102員工杯紀錄').select({
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
            const recordDatetime = new Date(time);
            console.log(now.getMonth()+ 1, now.getDate(), recordDatetime.getMonth()+1, recordDatetime.getDate())
            if(now.getMonth()+ 1 > recordDatetime.getMonth()+1 ||  now.getDate() > recordDatetime.getDate() ){
                return;
            }
            $(this).addRecordElem(subData);
        });
        fetchNextPage();
        $('#loader').hide();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}