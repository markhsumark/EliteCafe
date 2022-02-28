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
        }else{
            $(this).doSubmit();
        }
    })
})

$.fn.doSubmit = function(){
    
    const time = $(this).transDaytime(new Date());
    const item = $('#item').val();
    const amount = parseInt($('#amount').val());
    const user = $('#username').val();
    const note = $('#note').val();
    // var selectedFile = $('#file').get(0).files[0];
    // console.log(URL.createObjectURL(selectedFile));
    // const data = {
    //     '時間': $(this).transDaytime(new Date()),
    //     '收/支':io,
    //     '項目':$('#item').val(),
    //     '金額':parseInt($('#amount').val()),
    //     '登記人':$('#username').val(),
    //     '備註':$('#note').val(),
    //     '收據':[
    //         {
    //             'url':URL.createObjectURL(selectedFile)
    //         }
    //     ]
    // };
    // console.log(data);
    base('1102收支紀錄').create([
        {    
            'fields':{
                '時間': time,
                '項目':item,
                '收/支':io,
                '金額':amount,
                '登記人':user,
                '備註':note
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
    });
    
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