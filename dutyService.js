var stuffName; 

$(document).ready(function() {
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