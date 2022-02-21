const AIRTABLE_API_KEY = 'keydkLuej5kiWSXDO'
var app = document.getElementById('root');

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
// const app = document.getElementById('root');
var base = Airtable.base('appZMeryAPbdoYdnn');

base('銷售紀錄').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 5,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        const time = record.get('時間')
        const drink = record.get('飲品')
        const count = record.get('數量')
        const price = record.get('金額')
        console.log('Retrieved', record.get('飲品'));
        const h4 = document.createElement('h4');
        h4.textContent = "時間"+ time + drink +","+ count + "杯, $"+ price;
        app.appendChild(h4);

    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});