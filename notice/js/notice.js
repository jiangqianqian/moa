$(function() {

    $title = $('#title');
    $subTitle = $('#subTitle');
    $content = $('#content');
    $comment = $('#comment');
    $comments = $('#comments');
    $commentsCount = $('#commentsCount');
    $commentsCont = $('#commentsCont');
    $noData = $('#noData');
    var maxItems;
    var last = 0;
    var loading = false;
    var currentPage = 1;
    var noticeId;
    var personId;

    function initData() {
        // 初始化数据
        var local = window.location.search.substring(1).split(/&/);
        // console.log(local);
        noticeId = local[1];
        var data = {
            id: noticeId,
            type: local[0]
        };

        $.ajax({
            url: api + '/notice/getParticulars',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                if (data.code == '1000') {
                    data = data.data;
                    var clickCount = data.clickCount;
                    // 标题
                    $title.html(data.title);
                    // <!-- admin 2014-11-19 阅读(100) -->
                    $subTitle.html((data.orgName ? data.orgName : '') + ' ' + data.personName + ' ' + data.date + (clickCount ? ' 阅读(' + data.clickCount + ')' : ''));
                    $content.html(data.content);

                    if (data.discuss && data.discuss !== 1) {
                        $comments.removeClass('none');
                        getComment();
                    }

                } else {
                    $.alert(data.msg);
                }

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

                        // 添加新条目
                        getComment();

                        //容器发生改变,如果是js滚动，需要刷新滚动
                        $.refreshScroller();
                    }, 1000);
                });

            },
            error: function() {
                $.alert('不好意思，出错了~~');
            }

        });

    }

    function getComment(params) {
        var html = '';
        var data = $.extend({
            id: noticeId,
            page: currentPage++,
            pageSize: 6
        }, params);

        $.ajax({
            url: api + '/notice/commentList',
            type: 'POST',
            data: data,
            dataType: 'json',
            beforeSend: function() {
                if (!$('.infinite-scroll-preloader').find('.preloader').length) {
                    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
                }

                $noData.remove();
            },
            success: function(data) {
                if (data.code == '1000') {
                    data = data.data;
                    var list = data.items;
                    var len = list.length;
                    maxItems = data.recordCount;
                    for (var i = 0; i < len; i++) {
                        var item = list[i];
                        html += '<div class="card js-reply" data-name="' + item.personName + '"><div class="card-content"><div class="card-content-inner"><p><strong>' + item.orgName + ' ' + item.personName + '</strong> <span class="pull-right fc-sm-999">' + item.date + '</span></p><p class="mt5">' + html2Escape(item.content) + '</p></div></div></div>';
                    }
                    last += len;
                    // console.log(maxItems, last, data.currentPage);

                    // 添加新条目
                    $commentsCont.append(html);
                    $commentsCount.html(maxItems);
                    if (last >= maxItems) {
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));

                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
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

    $(document).on('click', '.js-reply', function() {

        var self = $(this);
        var name = self.data('name');

        reply(name);

    });

    $(document).on('click', '#comment', function() {
        reply();
    });

    function reply(name) {
        var re = '';
        if (name) {
            re = '回复' + name + '：';
        }
        var html = '<div class="list-block"><textarea id="reply">' + re + '</textarea></div>' +
            '<div class="self-modal-btn">' +
            '<span class="self-modal-button button-lines" id="cancel">取消</span>' +
            '<span class="self-modal-button" id="determine">确定</span>' +
            '</div>';
        setTimeout(function() {
            var modal = $.modal({
                text: html
            });

            $('#cancel').on('click', function() {
                $.closeModal(modal);
                $('.modal-overlay').remove();
            });

            $('#determine').on('click', function() {
                var reply = $('#reply').val();
                if (!reply) {
                    $.toast('请输入评论内容');
                    return false;
                } else if (name && reply.length == 5) {
                    $.toast('请输入回复内容');
                    return false;
                }

                $.ajax({
                    url: api + '/notice/commentAdd',
                    type: 'POST',
                    data: {
                        id: noticeId,
                        content: reply,
                        mobile: 13418490922
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == '1000') {
                            name ? $.toast('回复成功') : $.toast('评论成功');
                            $commentsCont.empty();
                            currentPage = 1;
                            getComment();
                            $.closeModal(modal);
                            $('.modal-overlay').remove();
                        }
                    }
                });

            });
        }, 100);
    }

    function html2Escape(sHtml) {
        return sHtml ? sHtml.replace(/[<>&"]/g, function(c) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
        }) : '';
    }
    $.init();
    initData();
});
