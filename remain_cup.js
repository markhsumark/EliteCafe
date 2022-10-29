
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
    const discountData = localStorage.getItem('寄杯優惠資料');
}