var stuffName; 
var stuffId;
$(document).ready(function() {
    $('#loader').hide();
    $('#find_btn').click(function(){
        $(this).getPersonalDutyData($('#staff_name').val());
        stuffName = $('#staff_name').val();
    })
})

$.fn.setDutyDataElm = function(dutyData){
    $('#name').text(stuffName);
    $('#point').text(dutyData['剩餘點數']);
    $('#hour').text(dutyData['累計時數']);
}



const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');

$.fn.getPersonalDutyData = function(input_name){
    $('#loader').show();
    var points;
    var dutyHours;
    var check = false;
    base('員工時數紀錄').select({
        view: "Grid view",
    }).eachPage(function page(records, fetchNextPage){
        records.forEach(function(record){
            const name = record.get('名字');
            if(name == input_name){
                points = parseInt(record.get('剩餘點數'));
                dutyHours = parseInt(record.get('累計時數'));
                console.log(points);
                check = true
                stuffId = record.id;
                console.log('Retrieved', record.id);
                return;
            }
        })
        $('#loader').hide();
        if(check){
            const data = {'剩餘點數': points, '累計時數': dutyHours};
            $(this).setDutyDataElm(data);
            $('#exchange').show();
            $('#checkin').show();
            
            return true;
        }else{
            console.log('找不到對應的資料');
            alert('請輸入正確的姓名');
            return false;
        }
    }, function done(err) {
        if (err) { console.error(err); return; }
    })
}
$.fn.decAirTbPoint = function(){
    
    base('員工時數紀錄').update([
        {
          "id": stuffId,
          "fields": {
            "名字": stuffName,
            "剩餘點數": 0,
            "累計時數": 0
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function(record) {
          console.log(record.get('剩餘點數'));
        });
      });
}