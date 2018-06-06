$(function() {
    var $listContainer = $('.list-container');
    var $cancel = $('#cancel');
    var $searchBox = $('#searchBox');

    // 加载flag
    var loading = false;

    // 最多可加载的条目
    var maxItems;

    var type = window.location.search.substring(1);

    function addItems(params, callBa, search) {
        // 生成新条目的HTML
        var html = '';
        var data = $.extend({
            page: 1,
            pageSize: 20,
            mobile: 13418490922,
            type: type
        }, params);

        $.ajax({
            url: api + '/notice/list',
            type: 'POST',
            data: data,
            dataType: 'json',
            beforeSend: function() {
                if (!$('.infinite-scroll-preloader').find('.preloader').length) {
                    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
                }
            },
            success: function(data) {
                // console.log(data);
                if (data.code == '1000') {
                    data = data.data;
                    var list = data.items;
                    if (list) {
                        callBa && callBa();
                        var len = list.length;
                        if (!len) {
                            $('#noData').removeClass('none');
                            if (search) {
                                $('#noData').html('没有找到“<span class="key">' + params.keyword + '</span>”相关数据');
                            } else {
                                $('#noData').html('暂无数据');
                            }
                            return;
                        }
                        // console.log(list);
                        maxItems = data.recordCount;
                        last += len;
                        for (var i = 0; i < len; i++) {
                            var item = list[i];
                            html += '<li><a href="notice.html?' + item.type + '&' + item.id + '" class="item-link item-content external"><div class="item-inner"><div class="item-title-row">' + item.title + '</div><div class="item-subtitle item-midtitle">' + item.personName + '</div><div class="item-subtitle item-smtitle">' + item.date + (item.type === 'NOTICE' ? '&nbsp;&nbsp;阅读(' + item.clickCount + ') &nbsp;&nbsp;评论(' + item.commentsCount + ')' : '') + '</div></div></a></li>';
                        }

                        // 添加新条目
                        $('.infinite-scroll-bottom .list-container').append(html);
                        var last = $listContainer.find('li').length;
                        if (last >= maxItems) {
                            // 加载完毕，则注销无限加载事件，以防不必要的加载
                            $.detachInfiniteScroll($('.infinite-scroll'));

                            // 删除加载提示符
                            $('.infinite-scroll-preloader').remove();
                            $('.infinite-scroll-bottom .list-container').append('<li><div class="item-inner text-center item-totalnum">总共' + last + '条</div></li>');

                        }

                    }

                } else {
                    $.alert(data.msg);

                }

            },
            error: function() {
                $.alert('不好意思，出错了~~');
            }

        });

    }

    //预先加载20条
    addItems();

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom', function() {
        // 如果正在加载，则退出
        if (loading) return;

        // 设置flag
        loading = true;

        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;

            if (last >= maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('.infinite-scroll'));

                // 删除加载提示符
                $('.infinite-scroll-preloader').remove();
                return;
            }

            // 添加新条目
            addItems({
                keyword: $searchBox.val()
            });

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });

    $cancel.on('click', function() {
        $searchBox.val('');
    });

    $searchBox.on('keypress', function(e) {
        if (e.charCode === 13) {
            addItems({
                keyword: this.value
            }, function() {
                $listContainer.empty();
            }, !0);
        }
    });


    $.init();
});
