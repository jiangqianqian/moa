$(function() {

  //获取楼层的会议室名称
  var meetNamefun = function(storey) {
    $('#bookRoomContent').scrollTop(0);
    if (pre) { pre = ''; };

    $.showIndicator();
    $.ajax({
      type: 'POST',
      url: api + '/meeting/meetingList',
      data: {
        storey: storey,
        mobile: mobile
      },
      dataType: 'json',
      success: function(data) {
        if (data.code === 1000) {
          var html = template('roomBoxTpl', data);
          $('#roomBox').html(html);
          var htmls = template('roomBoxTplHead', data);
          $('#tableHead').html(htmls);

          //获取已经预定的会议室
          meetTimefun(storey);
        } else {
          $.alert(data.msg);
        }
      },

      error: function() {
        $.hideIndicator();
        $.alert('不好意思，出错了~~');
      }
    });
  };

  //已经预定的会议室
  var meetTimefun = function(storey) {
    $.ajax({
      type: 'POST',
      url: api + '/meeting/reserveList',
      data: {
        storey: storey,
        date: $('#useDate .active').data('senddate')
      },
      dataType: 'json',
      success: function(data) {
        //预订的数据
        $.hideIndicator();
        if (data.code === 1000) {
          for (var i = 0, len = data.data.items.length; i < len; i++) {
            var complex = data.data.items[i];
            var cfid = complex.conferenceId;
            var conferenceName = complex.conferenceName;
            var dates = complex.dates;
            var orgName = complex.orgName;
            var personName = complex.personName;
            var title = complex.title;
            var mobile = complex.mobile;
            var tdReuslt = $('[data-roomid="' + cfid + '"]');
            var startTime = startEndStr(dates)[0];
            var duration = startEndStr(dates)[2];

            //var colors = ['#03a9f4', '#00BCD4', '#2196F3', '#4CAF50', '#0288D1', '#009688','#8BC34A'];
            var colors = ['#03a9f4', '#ff8e6b', '#f6bf26', '#f65e5e', '#6bb5ce', '#5c6bc0', '#78c06e', '#9a89b9', '#a1887f', '#78919d', '#5e97f6', '#bd84cd', '#3bc2b5', '#a1887f', '#c5cb63'];
            for (var j = 0; j < tdReuslt.length; j++) {
              var _this = tdReuslt.eq(j);
              var tempTime = parseInt(_this.parent().find('td').eq(0).data('start'), 10);
              var htmlStr = '';
              if (title) {
                htmlStr = orgName + '<br/>' + personName + '<br/>' + title;
              } else {
                htmlStr = orgName + '<br/>' + personName;
              }

              if (tempTime == startTime) {
                _this.attr({ rowspan: duration, 'data-mobile': mobile }).addClass('m-checked').css('background-color', colors[i % (colors.length)]).html('<a href="tel:' + mobile + '"><span class="m-checked-inner wrap-break">' + htmlStr + '</span></a>');
                for (var m = 1; m < duration; m++) {
                  tdReuslt.eq(j + m).css('display', 'none');
                }

                break;
              }

            }
          }

          passTimefun();
        } else {
          $.alert(data.msg);
        }

      },

      error: function() {
        $.hideIndicator();
        $.alert('不好意思，出错了~~');
      }
    });
  };

  //判断过期时间
  var passTimefun = function() {
    var passTime = parseInt(date.getHours() + 1, 10);
    var str = '<div class=\"checked-item-timeout\">过期</div>';
    $('.m-table').find('td').each(function() {
      var _this = $(this);
      var parent = _this.parent();
      var showStartTime = parseInt(_this.parent().find('td').eq(0).data('start'), 10);
      if (!_this.hasClass('m-checked') && _this.index()) {
        if (passTime > showStartTime && $('#useDate').find('a').eq(0).hasClass('active')) {
          _this.html(str);
        }

      }

    });
  };

  var zeroFill = function(str) {
    return ('00' + str).substr(-2);
  };

  var formatDate = function(objTime) {
    var year = objTime.getFullYear();
    var month = ('00' + (objTime.getMonth() + 1)).substr(-2);
    var day = objTime.getDate();
    return year + '-' + month + '-' + day;
  }

  //时间算取
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dates = date.getDate();
  var dateStr = month + '-' + dates;
  // var month2 = month + 1;
  // var year2 = year;
  // if (month2 > 12) {
  //   year2++;
  //   month2 = 1;
  // }

  var curDate = formatDate(date);

  //获取前一天日期
  var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
  var yesterday = new Date();
  yesterday.setTime(yesterday_milliseconds);
  var minDate = formatDate(yesterday);

  // var days2 = new Date(year2, month2, 0).getDate();
  // if (days2 > dates) {
  //   days2 = dates;
  // }

  //var maxDate = year2 + '-' + zeroFill(month2) + '-' + days2;

  $('#meetingDate').val(curDate).calendar({
    value: [curDate],
    minDate: minDate,
    onChange: function(p, values, displayValues) {
      console.log(displayValues);
    }
  });


  //一般权限
  var weekArr = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  var getDay = date.getDay();
  var useDays = [0, 1, 2];
  switch (getDay) {
    case 0:
      {
        useDays = [1, 2, 3];
        break;
      }

    case 4:
      {
        useDays = [0, 1, 4];
        break;
      }

    case 5:
      {
        useDays = [0, 3, 4];
        break;
      }

    case 6:
      {
        useDays = [2, 3, 4];
        break;
      }

  }

  $('#useDate').html('');
  for (var i = 0; i < 3; i++) {
    var dayTemp = (date.getDay() + useDays[i]) % 7;
    $('#useDate').append('<a href="javascript:;" class="tab-links button" data-senddate=' + year + '-' + ('00' + month).substr(-2) + '-' + (dates + i) + '>' + weekArr[dayTemp] + '(' + ('00' + month).substr(-2) + '-' + (dates + useDays[i]) + ')</a>');
  }

  $('#useDate').find('a').eq(0).addClass('active');

  //初始化时间表
  meetNamefun(6);

  //判断前面一次增加节点的index
  var pre = '';

  //arr 用于存储前后两端tr的id值
  var arr = [];

  $(document).on('click', '.m-table td', function(e) {
    var _this = $(this);
    if (_this.find('.checked-item-timeout').length) return;
    if (!_this.hasClass('m-checked')) {
      var timeEl = _this.siblings('td').eq(0);
      var start = timeEl.data('start');
      var end = timeEl.data('end');
      var _index = _this.index();

      if (!pre) {
        pre = _index;
      }

      if (_index) {

        //获取父级id
        var praid = parseInt(_this.parents('tr').attr('id'), 10);
        var $curItem = _this.find('.checked-item');

        //删除
        if ($curItem.length) {

          //获取首个选中元素id
          var firstid = arr[0];
          var lastid = arr[arr.length - 1];

          if (arr.length === 1) {
            $curItem.remove();
          }

          if (praid == lastid) {
            arr[arr.length - 1] = lastid - 1;
            $('#' + lastid).find('td').eq(_index).html('');

          } else {
            for (var i = firstid; i <= praid; i++) {
              $('#' + i).find('td').eq(_index).html('');
            }

            arr[0] = praid + 1;
          }

          //判断是否所有的选中都被取消
          if (!$('.checked-item').length) {
            pre = '';
          }

        } else if (pre === _index) {
          //增加
          var str = '<div class="checked-item"><span class="icon icon-check"></span></div>';
          _this.html(str);
          var $allItem = $('.checked-item');

          //连接会议
          if ($('.checked-item').length > 1) {
            if (arr.length) { arr = []; };

            arr[0] = parseInt($allItem.first().parents('tr').attr('id'), 10);
            arr[1] = parseInt($allItem.last().parents('tr').attr('id'), 10);

            //判断中间是否有会议被占用
            for (var i = arr[0]; i <= arr[arr.length - 1]; i++) {
              if ($('.m-table').find($('#' + i)).find('td').eq(_index).hasClass('m-checked')) {
                $.alert('请选择连续的开会时间段');
                _this.html('');
                return false;
              }
            }

            $('.checked-item').each(function() {
              $(this).remove();
            });

            for (var i = arr[0]; i <= arr[arr.length - 1]; i++) {
              $('.m-table').find($('#' + i)).find('td').eq(_index).html(str);

            }

          } else {
            arr = [];
            arr[0] = parseInt($allItem.first().parents('tr').attr('id'), 10);
          }
        } else if (pre !== _index) {
          $.alert('不同会议室请分开预定!');
        }
      }
    }

    if ($('.checked-item').length) {
      $('.js-bookbtn').parent('nav').addClass('db');
    } else {
      $('.js-bookbtn').parent('nav').removeClass('db');
    }

  });

  /*tab切换事件已点击选择某一时间框，
   * 若切换日期或楼层，提示“已选择时间段将被取消”，
   * 若点击取消，停留在原来界面，若点击确定，切换至筛选条件下的结果页面，
   * 并清空已选择的时间段*/
  $('.js-tabs').on('click', 'a', function() {
    var _this = $(this);
    var $obj;
    _this.addClass('active').siblings().removeClass('active');
    if (_this.parent().hasClass('radio-list')) {
      $obj = _this;
    } else {
      $obj = $('.radio-list').find('.active');
    }

    var storey = $obj.find('.storey-num').text();
    meetNamefun(storey);
  });

  $('.js-bookbtn').on('click', function() {
    var useDate = $('#useDate').children('.active').text();
    var sendDate = $('#useDate').children('.active').data('senddate');
    var conference = $('.m-table').find('.checked-item').eq(0).parent().data('room');
    var index = $('.m-table').find('.checked-item').eq(0).index();
    var roomId = $('.m-table').find('.checked-item').eq(0).parent().data('roomid');

    var timeStart = parseInt($('#' + arr[0]).find('td').eq(0).data('start'), 10);

    var timeEnd = parseInt($('#' + arr[arr.length - 1]).find('td').eq(0).data('end'), 10);

    var dates = '';
    var datesShow = '';

    for (var i = timeStart; i < timeEnd; i++) {
      var space = ',';
      if (i === timeStart) { space = ''; }

      if (i === 12 || i === 13) continue;
      dates += space + i + '-' + (i + 1);
      datesShow += space + i + ':00-' + (i + 1) + ':00';
    }

    var bookVal = {
      useDate: useDate,
      sendDate: sendDate,
      dates: dates,
      conference: conference,
      roomId: roomId,
      datesShow: datesShow
    };

    window.sessionStorage.setItem('bookVal', JSON.stringify(bookVal));
  });
});
