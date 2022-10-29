
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
        }else{
            $(this).postOrder('寄杯紀錄');
        }
    })
    $("#search").click(function(){
        console.log('search');
        $(this).searchCostumerData();
    })
})


$.fn.addDiscountElem = function(name, i){
    const option = $('<option></option>').text(name);
    $('#discontSel').append(option);
}


function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}
$.fn.searchCostumerData =function(){
    const key = $('#search_number').val();
    $('#result').empty();
    $(this).getDiscountRecord(key);
}
$.fn.setResultList = function(result){ 
    const tr = $("<tr></tr>");
    const tdinfo = $("<td></td>").text(result['顧客資訊']);
    const tdcase = $("<td></td>").text(result['優惠方案']);
    const tdregister = $("<td></td>").text(result['登記人']);
    const tdremain = $("<td></td>").text(result['剩餘兌換次數']);
    const tdrecord = $("<td></td>").text(result['兌換紀錄']);
    tr.append(tdinfo, tdcase, tdregister, tdremain, tdrecord);
    $('#result').append(tr);
}

function select_discount(){
    const sel = $('#discontSel').val();
    console.log("!!!", sel);
    $('#sel_text').text(sel);
}