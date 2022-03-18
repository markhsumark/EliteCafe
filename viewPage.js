var totalPrice = 0;

$(document).ready(function() {
    $(this).getAirtbData();
})

$.fn.addRecordElem = function(record){
    totalPrice += record['金額'];
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

    $('#total').text(totalPrice);
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