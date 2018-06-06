var addrbook = {
  searchList: function() {
    $('#searchBtn').on('click', function() {
      var tempdata = { list: [] };
      var text = $('#search').val();
      var $sl = $('#searchList');
      var $snr = $('#searchNoresult');
      var $id;
      if (text === '') {
        $('#search').focus();
        $snr.hide();
        return;
      }

      $.showIndicator();
      $.ajax({
        type: 'POST',
        url: api + '/contactsList',
        data: { keyword: text, mobile: '13714717742' },
        dataType: 'json',
        success: function(data) {
          if (data.code === 1000) {
            $.hideIndicator();
            $sl.empty();
            var array = data.data.items;
            if (!array.length) {
              $snr.show();
            } else {
              $snr.hide();
              $.each(array, function(commentIndex, comment) {
                tempdata.list[commentIndex] = comment;
              });

              //生成搜索列表
              var html = template('searchItem', tempdata);
              $sl.html(html);

              //生成电话列表
              $('.btn-phone').each(function() {
                $(this).on('click', function(e) {
                  e.stopPropagation();
                  var tel = $(this).attr('data-mobile');
                  var tel2 = $(this).attr('data-cell');
                  var buttons1 = [];
                  if (tel2 === '') {
                    $(this).attr('href', 'tel:' + tel);
                  } else {
                    buttons1 = [{
                      text: '<a href="tel:' + tel + '">' + tel + '</a>'
                    }, {
                      text: '<a href="tel:' + tel2 + '">' + tel2 + '</a>'
                    }];
                    var buttons2 = [{
                      text: '取消'
                    }];
                    var groups = [buttons1, buttons2];
                    $.actions(groups);
                  }
                });
              });

              //指向详情页
              $sl.find('li').on('click', function() {
                var key = $(this).attr('data-id');
                var url = './detail.html?id=' + key;
                window.location.href = url;
              });

            }
          } else {
            $.alert(data.msg);
          }
        },

        error: function(xhr, errorType, error) {
          $.hideIndicator();
          $.alert('不好意思，出错了~~');
        }
      });
    });

  },

  detail: function() {
    var url = window.location.href;
    var idstr = url.substring(url.lastIndexOf('?') + 1).split('=')[1];
    var param = {};
    $.ajax({
      type: 'POST',
      url: api + '/contactsList/toPersonDetail',
      data: { id: idstr },
      dataType: 'json',
      success: function(data) {
        if (data.code === 1000) {
          param = data.data;
          var html = template('searchResult', param);
          $('#addrlist').html(html);
        } else {
          $.alert(data.msg);
        }
      },

      error: function(xhr, errorType, error) {
        $.alert('不好意思，出错了~~');
      }
    });
  }
};
