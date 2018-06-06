$(function() {
  /*添加与会人员*/
  var personIdArr = [];
  var personNameArr = [];
  var additem = {
    'items': [],
    'count': 0
  };
  /*已经选择的人员的读取*/
  var personSession = window.sessionStorage.person;
  if (personSession) {
    var person = JSON.parse(personSession);
    personIds = person.personIds;
    personIdArr = personIds.split(',');
    personNameArr = (person.personName).split(',');
    /*已添加人员*/
    additem = person.additem;
    var html = template('addedPerTpl', additem);
    $('#addedPer').html(html);
  }
  /*删除已经选择人员*/
  $(document).on('click', '.js-perdel', function() {
    var liEl = $(this).closest('li');
    var _index = liEl.index();
    var _id = liEl.data('perid');
    $.confirm('确定删除？', function() {
      var counttxt = $('#addedCount').text();
      liEl.remove();
      $('#addedCount').text(parseInt(counttxt, 10) - 1);
      additem.count = parseInt(counttxt) - 1;
      personIdArr.splice(_index, 1);
      personNameArr.splice(_index, 1);
      (additem.items).splice(_index, 1);
      $('#searchList li').each(function(index, item) {
        if ($(this).data('perid') == _id) {
          $(this).remove();
        }
      })

    });
  });
  /*添加人员*/
  $(document).on('click', '.js-peradd', function() {
    var _this = $(this);
    var liEl = _this.closest('li');
    if (!($(this).hasClass('disabled'))) {
      $.confirm('确定添加?', function() {
        var counttxt = $('#addedCount').text();
        _this.addClass('disabled').html('已经添加');
        var perId = _this.closest('li').data('perid');
        var personName = _this.closest('li').data('pername');
        var orgName = _this.closest('li').data('orgname');
        personIdArr.push(perId);
        personNameArr.push(personName);
        /*添加人员*/
        var perData = {
          'id': perId,
          'orgName': orgName,
          'personName': personName
        };
        (additem.items).push(perData);
        var html = template('addedPerTpl', additem);
        $('#addedPer').html(html);
        additem.count = parseInt(counttxt, 10) + 1;
        $('#addedCount').text(parseInt(counttxt, 10) + 1);
      });
    }
  });
  /*搜索按钮*/
  $('#searchBtn').on('click', function() {
    var search = $('#search').val().trim();
    if (search.length > 0) {
      $.ajax({
        type: 'POST',
        url: api + '/contactsList/listByKeyword',
        data: {
          'keyword': search,
          'mobile': mobile
        },
        dataType: 'json',
        beforeSend: function(XMLHttpRequest) {
          $.showIndicator();
        },
        success: function(data) {
          $.hideIndicator();
          if (data.code == 1000) {
            var dataItem = data.data;
            var perId = '';
            var len = (dataItem.items).length;
            
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                perId = dataItem.items[i].id;
                
                if ($.inArray(perId, personIdArr) > -1) {
                  dataItem.items[i].isAdded = false;
                } else {
                  dataItem.items[i].isAdded = true;
                }
              }
              console.log(dataItem);
              var html = template('searchListTpl', dataItem);
              $('#searchList').html(html);
            } else {
              $('#searchList').html('<div class="tip">对不起，没有搜索结果！</div>');
            }
          } else {
            $.alert(data.msg);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          $.hideIndicator();
          $.alert('不好意思，出错了~~');
        }
      });
    } else {
      $.alert('请输入关键字!');
    }
  });
  /*确定按钮存储数据*/
  $(document).on('click', '#personAdd', function() {
    if (personIdArr.length > 0) {
      var person = {
        'personIds': personIdArr.join(),
        'personName': personNameArr.join(),
        'additem': additem
      };
      window.sessionStorage.setItem('person', JSON.stringify(person));
      location.href = 'meeting_manage.html';
    } else {
      $.alert('请选择与会人员！')
    }
  })
})
