var api = 'http://172.16.72.31:8888/api';
var mobile = '13714717742';

function startEndStr(str) {
  var strTrim = str.trim();
  var start = strTrim.indexOf('-');
  var end = strTrim.lastIndexOf('-');
  var startStr = strTrim.substr(0, start);
  var endStr = strTrim.substr(end + 1, strTrim.length);
  var len = (strTrim.split(',')).length;
  return (startStr + ',' + endStr + ',' + len).split(',');
}

// 搜索清除功能
$(function() {
  $('#search').on('focus', function() {
    $('#hairline').show();
  }).on('blur', function() {
    $('#hairline').hide();
  });

  $('#hairline').on('click', function() {
    $('#search').val('').focus();
  });
});
