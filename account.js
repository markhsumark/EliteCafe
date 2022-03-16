const AIRTABLE_API_KEY = 'keyAOWkrD4cGjPUSj'

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base('app6O0zKUAqzHhqzV');
var io = "";

$(document).ready(function(){
    $('#submit').click(function(){
        if($('#item').val() == ""){
            alert('請輸入項目！');
        }else if($('#amount').val() == null){
            alert('請輸入金額！');
        }else if($('#username').val() == ""){
            alert('請輸入登記人！');
        }else if(parseInt($('#amount').val()) <= 0){
            alert('金額不可為負！');
        }else if(io == ""){
            alert('請選擇收入或支出！');
        }else{
            alert('上傳中...')
            $(this).doSubmit();
        }
    })
})

$.fn.doSubmit = function(){
    
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