const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("automation");

const pendingSubject = ss.getRange('AE3').getValue();
const message = ss.getRange('AE5').getValue();
const completedSubject = ss.getRange('AE4').getValue();
const noOfpendingTasks = ss.getRange('AE1').getValue();
const noOfcompletedTasks = ss.getRange('AE2').getValue();


function escalationTasksPending() {
  const pTasksValues = ss.getRange('A2:K').getValues();

  var pendingTasks = pTasksValues.filter(function (x) {
    return !(x.every(element => element === undefined || element === null || element === ''))
  });

  var pHeader = ss.getRange('A1:K1').getValues()
  pendingTasks.unshift(pHeader[0]);

  var body = pTasksTable(pendingTasks);
  return body;
}

function escalationTasksCompleted(){
  const cTasksValues = ss.getRange('N2:X').getValues();

  var completedTasks = cTasksValues.filter(function (x) {
    return !(x.every(element => element === undefined || element === null || element === ''))
  });

  var cHeader = ss.getRange('N1:X1').getValues();
  completedTasks.unshift(cHeader[0]);

  var body = pTasksTable(completedTasks);
  return body
}


function pTasksTable(data) {
  var table = '<html> <body>' + '<p style="font-family:Cambria, serif; font-size: 15px">' + message + '</p>' +'<table align="center" style="margin:0px auto; width:90%;table-layout:fixed; border-collapse:collapse;">';

  var col1style = 'style="text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 10%"';
  var col2style = 'style="text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 20%"';
  var col3style = 'style="text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 20%"';
  var col4style = 'style="text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 50%"';

  for(var i = 0; i < data.length; i++) {
    var cells = data[i];
    table = table + '<tr>';
    
    for(var j = 0; j < cells.length; j++) {
      if(i == 0) {
        if(j == 0) {
          table = table + '<th style="background-color:#FFC000; text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 10%"'+ col4style +'>' + cells[j] + '</th>';
        }
        else if (j == 4){
          table = table + '<th style="background-color:#FFC000; text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 50%"'+ col2style +'>' + cells[j] + '</th>';
        }
        else if(j == 1) {
          table = table + '<th style="background-color:#FFC000; text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 20%"'+ col2style +'>' + cells[j] + '</th>';
        }
        else {
          table = table + '<th style="background-color:#FFC000; text-align:center; vertical-align:center; border:solid 1px black; font-family: Cambria,serif; width: 20%"'+ col3style +'>' + cells[j] + '</th>';
        }
      }
      else {
        if(j == 1) {
          table = table + '<td '+ col2style + '>' + Utilities.formatDate(new Date(cells[j]),'GMT+5:30','MMMM-YYYY') + '</td>';
        }
        else if (j == 8){
          if(cells[j] == '') {
            table = table + '<td '+ col2style + '>' + cells[j] + '</td>';
          }
          else{
            table = table + '<td '+ col2style + '>' + Utilities.formatDate(new Date(cells[j]),'GMT+5:30','dd-MM-yyyy') + '</td>';
          }
        }
        else {
          if(j == 0) {
            table = table = table + '<td '+ col1style + '>' + cells[j] + '</td>';
          }
          else {
            table = table = table + '<td '+ col3style + '>' + cells[j] + '</td>';
          }
        }
      }
    }
    table = table + '</tr>';
  }

  table = table + '</table> </body> </html>';
  return table;
}


function pendingTasksMail() {
  const toMailIDs = ss.getRange('AD7:AD').getValues();
  const ccMailIDs = ss.getRange('AE7:AE').getValues();
  
  var toRecipients = toMailIDs.filter(function (x) {
    return !(x.every(element => element === (undefined || null || '')))
  });
  var ccRecipients = ccMailIDs.filter(function (x) {
    return !(x.every(element => element === (undefined || null || '')))
  });

  if(noOfpendingTasks > 0) {
    MailApp.sendEmail({
        to: toRecipients.join(','),
        cc: ccRecipients.join(','),
        subject: pendingSubject,
        htmlBody: emailChartSourceImage(ss).emailBody + escalationTasksPending(),
        inlineImages:emailChartSourceImage(ss).emailImages});
  }
  else {
    MailApp.sendEmail({
        to: toRecipients.join(','),
        cc: ccRecipients.join(','),
        subject: pendingSubject,
        htmlBody: emailChartSourceImage(ss).emailBody + "Great News!!!! There are no pending tasks as of now",
        inlineImages:emailChartSourceImage(ss).emailImages});
  }
}

function completedTasksMail() {
  const toMailIDs = ss.getRange('AD7:AD').getValues();
  const ccMailIDs = ss.getRange('AE7:AE').getValues();
  
  var toRecipients = toMailIDs.filter(function (x) {
    return !(x.every(element => element === (undefined || null || '')))
  });
  var ccRecipients = ccMailIDs.filter(function (x) {
    return !(x.every(element => element === (undefined || null || '')))
  });

  if(noOfcompletedTasks > 0) {
    MailApp.sendEmail({
        to: toRecipients.join(','),
        cc: ccRecipients.join(','),
        subject: completedSubject,
        htmlBody: emailChartSourceImage(ss).emailBody + escalationTasksCompleted(),
        inlineImages:emailChartSourceImage(ss).emailImages});
  }
  else {
    MailApp.sendEmail({
        to: toRecipients.join(','),
        cc: ccRecipients.join(','),
        subject: completedSubject,
        htmlBody: emailChartSourceImage(ss).emailBody + "There are no completed tasks as of now",
        inlineImages:emailChartSourceImage(ss).emailImages});
  }
}



function emailChartSourceImage(sheet){ 
  const charts = sheet.getCharts();

  // setup some variables for our email
  const chartBlobs = new Array(); 
  const emailImages = {};
  let emailBody = "<br>"; 
  
  charts.forEach(function(chart, i){
    chartBlobs[i] = chart.getAs("image/png");
    emailBody += "<p align='center'><img src='cid:chart"+i+"'></p>"; // Alligning the chart to the center of the body in the email
    emailImages["chart"+i] = chartBlobs[i];
  });

  return { emailBody: emailBody, emailImages: emailImages };
}


// function createTimeTriggerEvery3Days() {
//   ScriptApp.newTrigger("pendingTasksMail").timeBased().everyDays(3).create();
//   ScriptApp.newTrigger("completedTasksMail").timeBased().everyDays(3).create();
// }
