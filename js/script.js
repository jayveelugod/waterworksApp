$(document).ready(function() {
    months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'];
    
    $("#datepicker").datepicker( {
        format: "mm-yyyy",
        viewMode: "months", 
        minViewMode: "months"
    });

    months.forEach( function(month) {
        $("#month").append($('<option>', {
            value: month,
            text: month,
            selected: month === months[new Date().getMonth()] || false
        }));
    });

    var yearLength = 3;
    var currentYear = new Date().getFullYear();
    while ( yearLength >= 0 ) {
        $("#year").append($('<option>', {
            value: currentYear - yearLength,
            text: currentYear - yearLength,
            selected: (currentYear - yearLength) === currentYear || false
        }));
        yearLength--;
    }

});

function handleFiles(files) {
    $('.monthYearDivRow, .continueToBillBtn, .printPDF').attr('hidden', true);
    $('#billSection').html('');
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

var lines = [];
function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    for (var i=0; i < (allTextLines.length-1); i++) {
        var data = allTextLines[i].split(';');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
                var line = data[j].split(',');
                tarr.push({name: line[0], present: line[1], previous: line[2]});
            }
            lines.push(tarr);
    }
    // console.log(lines);
    // extractToBill(lines);
    // $('.uploadDiv').attr('hidden', true);
    $('.monthYearDivRow, .continueToBillBtn').removeAttr('hidden');
}

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function extractToBill(){
    $('.printPDF').removeAttr('hidden');
    $('#billSection').html('');
    var element = '';
    var ctr = 0;
    lines.forEach(function(data){
        table = (ctr % 3 === 0) ? '<table class="tg" class="tab_customers">' : '<table class="tg" class="tab_customers" style="margin-top: 5%">';
        element += table +
                        '<thead>'+
                        '<tr>'+
                            '<th class="tg-xldj" colspan="7" style="padding-bottom: 2%">'+
                            
                                'GETAFE WATER SYSTEM <br>'+
                                'GETAFE, BOHOL'+
                            
                            '</th>'+
                        '</tr>'+
                        '</thead>'+
                        '<tr>'+
                            '<td class="tg-xldj" colspan="2">Account Number</td>'+
                            '<td class="tg-xldj" colspan="2">Meter Serial No.</td>'+
                            '<td class="tg-0pky">Type</td>'+
                            '<td class="tg-0pky">Due Date</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-xldj" colspan="2">12345</td>'+
                            '<td class="tg-xldj" colspan="2">4321</td>'+
                            '<td class="tg-0pky">test</td>'+
                            '<td class="tg-0pky">Dec</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky" colspan="6" style="text-align: left !important">Name: <span style="font-size: 12px"><b>'+data[0].name.toUpperCase()+'</b></span></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky" colspan="6"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky" colspan="2">Period Covered</td>'+
                            '<td class="tg-0pky" colspan="2">Reading</td>'+
                            '<td class="tg-0pky" colspan="2">Actual Used</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky">Month</td>'+
                            '<td class="tg-0pky">Year</td>'+
                            '<td class="tg-0pky">Present</td>'+
                            '<td class="tg-0pky">Previous</td>'+
                            '<td class="tg-0pky">(cu. M.)</td>'+
                            '<td class="tg-0pky">Amount</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky">'+$("#month").val()+'</td>'+
                            '<td class="tg-0pky">'+$("#year").val()+'</td>'+
                            '<td class="tg-0pky">'+data[0].present+'</td>'+
                            '<td class="tg-0pky">'+data[0].previous+'</td>'+
                            '<td class="tg-0pky">'+(data[0].present - data[0].previous)+'</td>'+
                            '<td class="tg-0pky">275</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0pky exclude" colspan="4" rowspan="3" style="border-right-color: transparent; border-bottom-color: transparent;"></td>'+
                            '<td class="tg-0pky exclude" style="border-bottom-color: transparent;">Other Charges</td>'+
                            '<td class="tg-0pky"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0lax exclude" style="border-bottom-color: transparent;">Excess</td>'+
                            '<td class="tg-0lax"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0lax exclude" style="border-bottom-color: transparent;">Total Dues</td>'+
                            '<td class="tg-0lax"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="tg-0lax exclude" colspan="6" style="border-top-color: transparent; text-align: left !important">'+
                            '<p>Month<span style="padding-left: 2%">__________________________________________</span></p>'+
                            '<div style="margin-left: 50px">'+
                                'Please pay this bill within 5 days or we have'+
                                '<br>to discontinue serving your water needs.'+
                                '<br>(If payment has been made, please disregard this notice.)'+
                                '<br><br>'+
                                '<b>STATEMENT ACCOUNT</b><span style="padding-left: 20%"><b>No.</b></span>'+
                            '</div>'+
                            '</td>'+
                        '</tr>'+
                    '</table>';    
                    ctr++;
    });
    $('#billSection').html(element);
}

function printPDF(){
    var sTable = document.getElementById('billSection').innerHTML;

    var style = "<style>";
    style = style + "table {width: 100%;font: 12px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 1px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open('', '', 'height=900,width=1500');

    win.document.write('<html><head>');
    // win.document.write('<title>Water Bill</title>');   // <title> FOR PDF HEADER.
    win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
    win.document.write('</body></html>');

    win.document.close(); 	// CLOSE THE CURRENT WINDOW.

    win.print();    // PRINT THE CONTENTS.
}