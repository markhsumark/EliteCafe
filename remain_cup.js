var all_records = []
$(document).ready(function(){
    // $(this).getAirtbData();
    $(this).getDiscountData();

    $("#submit_remain_cup").click(function(){
        console.log("submit");
        if($("#username").val() == ""){
            alert("請輸入登記者姓名");
            return;
        }else if($('#phone_number').val() == ''){
            alert("輸入顧客電話號碼");
            return;
        }else if($('#discontSel').val() == ''){
            alert("選擇優惠方案");
            return;
        }
        if(confirm('選擇為： '+ $('#discontSel').val())){
            $(this).postOrder('寄杯紀錄');
        }
       
    })
    $("#search").click(function(){
        console.log('search');
        $(this).searchCostumerData();
    })
})


$.fn.addDiscountElem = function(name){
    const option = $('<option></option>').text(name);
    $('#discontSel').append(option);
}


function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}
$.fn.searchCostumerData =function(){
    const key = $('#search_number').val();
    $('#result').empty();
    all_records = [];
    $(this).getDiscountRecord(key);
}

$.fn.setResultTable = function(result){
    result['顧客資訊'] = hideNumber(result['顧客資訊'])
    const tr = $("<tr></tr>");
    const tdinfo = $("<td></td>").text(result['顧客資訊']);
    const tdcase = $("<td></td>").text(result['優惠方案']);
    const t = $("<h3></h3>").text(result['剩餘兌換次數'])
    t.css('color', 'blue')
    const tdremain = $("<td></td>").append(t)
    const btnCousume = $("<button></button>").attr('class', 'btn btn-danger').text('使用')
    btnCousume.attr('id', result['id'])
    btnCousume.attr('onclick', 'exchange(this)')
    tr.append(tdinfo, tdcase, tdremain, btnCousume);
    $('#result').append(tr);
    
}
function exchange(ele){
    $('#result').empty();
    var list = []
    all_records.forEach(function(record){
        if(record['id'] == ele.id){
            if(confirm("確定要兌換？")){
                record['剩餘兌換次數'] -= 1;
                $(this).updateDiscountRecord(record);
            }
        }
        if(record['剩餘兌換次數'] <= 0){
            alert('兌換完畢！')
            $(this).deleteDiscountRecord(record);
        }else{ 
            list.push(record);
            $(this).setResultTable(record);
        }
    })
    all_records = list;
}
function hideNumber(number){
    var hidden = '';
    for(var i = 0; i < number.length; i++){ 
        if(i >= 4 && i <= 6){
            hidden+='x';
        }else{
            hidden+=number[i];
        }
    }
    return hidden;
}
function select_discount(){
    const sel = $('#discontSel').val();
    console.log(getDiscountLocalDataByName(sel))
    const price = getDiscountLocalDataByName(sel, '價格');
    console.log("選擇", sel);
    $('#sel_text').text(sel+': '+price);
}

function getDiscountLocalDataByName(name, target){
    const data = JSON.parse(localStorage.getItem('寄杯優惠資料'))
    var result = null;
    data.forEach(function(value) {
        if(strcmp(value['名稱'], name) == 0){
            result = value[target];
        }
    })
    return result;
}