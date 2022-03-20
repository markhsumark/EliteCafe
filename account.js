const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');
var io = "";

$(document).ready(function(){
    $(this).showReconciliation();
    $('#submit').click(function(){
        if($('#item').val() == ""){
            alert('請輸入項目！');
        }else if($('#amount').val() == null){
            alert('請輸入金額！');
        }else if($('#username').val() == ""){
            alert('請輸入登記人！');
        }else if(parseInt($('#amount').val()) < 0){
            alert('金額不可為負！');
        }else if(io == ""){
            alert('請選擇收入或支出！');
        }else{
            alert('請等待上傳完成再關閉頁面')
            $(this).postAccount();
        }
    })
    $('#submit-reconciliation').click(function(){
        if($('#amount-final').val() == null){
            alert('請輸入金額！');
        }else if($('#username-final').val() == ""){
            alert('請輸入登記人！');
        }else if(parseInt($('#amount-final').val()) < 0){
            alert('金額不可為負！');
        }else{
            alert('請等待上傳完成再關閉頁面')
            $(this).postReconciliation();
        }
    })
})
$.fn.postReconciliation = function(){
    $('#loader').show();
    const time = $(this).transDaytime(new Date());
    var amount = parseInt($('#amount-final').val());
    var amountTotal = parseInt($('#amount-total-final').val());
    const user = $('#username-final').val();
    const note = $('#note-final').val();
    base('收班對帳紀錄').create([
        {    
            'fields':{
                '時間': time,
                '備用金金額':amount,
                '總金額':amountTotal,
                '登記人':user,
                '備註':note,
            }
        }
        ], function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                $('#loader').hide();
                return;
            }
            $('#loader').hide();
            alert('上傳成功');
            $(this).refrashReconciliation();
            records.forEach(function (record) {
                console.log(record.getId());
            });
        }
    );
}
$.fn.refrashReconciliation = function(){
    $('#last-amount').empty();
    $(this).showReconciliation();
}
$.fn.showReconciliation = function(){
    base('收班對帳紀錄').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        view: "Grid view",
        sort: [{field: "時間", direction: "desc"}]
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            const date = record.get('日期');
            const amount = parseInt(record.get('備用金金額'));
            const amountTotal = parseInt(record.get('總金額'));
            const username = record.get('登記人');
            const tr =$('<tr></tr>');
            const td1 = $('<td></td>').text(date)
            const td2 = $('<td></td>').text(amount)
            const td3 = $('<td></td>').text(amountTotal)
            const td4 = $('<td></td>').text(username)
            tr.append(td1).append(td2).append(td3).append(td4);
            $('#last-amount').append(tr);
            console.log($('#last-amount'));
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}
$.fn.postAccount = function(){
    const time = $(this).transDaytime(new Date());
    const item = $('#item').val();
    var amount = parseInt($('#amount').val());
    if(io == '支出'){
        amount *= -1;
    }
    
    const user = $('#username').val();
    const note = $('#note').val();
    var ifReport = $('#if_report').is(":checked")
    if(ifReport == 'on'){
        ifReport = '可報帳';
    }else{
        ifReport = '不可報帳';
    }
    console.log(ifReport);
    base('1102收支紀錄').create([
        {    
            'fields':{
                '時間': time,
                '項目':item,
                '收/支':io,
                '金額':amount,
                '登記人':user,
                '備註':note,
                '可否報帳':ifReport
                // '收據':[
                //     {
                //         'url':URL.createObjectURL(selectedFile)
                //     }
                // ]
            }
        }
        ], function(err, records) {
            if (err) {
                alert("登記失敗(雲端尚未更新)")
                return;
            }
            alert('上傳成功')
            records.forEach(function (record) {
                console.log(record.getId());
            });
        }
    );
    
}
//輸入DATE格式 回傳YYYY/MM/DD
$.fn.transDaytime = function(datetime){
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const date = datetime.getDate();
    const time = year+"/"+month+"/"+date;
    return time;
}
function changeInOut(IO){
    io = IO.innerHTML;
    if(io == "收入"){
        $('#in').attr('class', 'btn btn-success')
        $('#out').attr('class', 'btn btn-outline-danger')
    }else if(io == "支出"){
        $('#in').attr('class', 'btn btn-outline-success')
        $('#out').attr('class', 'btn btn-danger')
    }
    console.log("change IO to "+ io);
}