$(function(){function t(){var t=window.location.search.substring(1).split(/&/);c=t[1];var n={id:c,type:t[0]};$.ajax({url:api+"/notice/getParticulars",type:"POST",data:n,dataType:"json",success:function(t){if("1000"==t.code){t=t.data;var n=t.clickCount;$title.html(t.title),$subTitle.html((t.orgName?t.orgName:"")+" "+t.personName+" "+t.date+(n?" 阅读("+t.clickCount+")":"")),$content.html(t.content),t.discuss&&1!==t.discuss&&($comments.removeClass("none"),e())}else $.alert(t.msg);$(document).on("infinite",".infinite-scroll-bottom",function(){s||(s=!0,setTimeout(function(){s=!1,e(),$.refreshScroller()},1e3))})},error:function(){$.alert("不好意思，出错了~~")}})}function e(t){var e="",n=$.extend({id:c,page:l++,pageSize:6},t);$.ajax({url:api+"/notice/commentList",type:"POST",data:n,dataType:"json",beforeSend:function(){$(".infinite-scroll-preloader").find(".preloader").length||$(".infinite-scroll-preloader").html('<div class="preloader"></div>'),$noData.remove()},success:function(t){if("1000"==t.code){t=t.data;var n=t.items,c=n.length;a=t.recordCount;for(var s=0;c>s;s++){var l=n[s];e+='<div class="card js-reply" data-name="'+l.personName+'"><div class="card-content"><div class="card-content-inner"><p><strong>'+l.orgName+" "+l.personName+'</strong> <span class="pull-right fc-sm-999">'+l.date+'</span></p><p class="mt5">'+o(l.content)+"</p></div></div></div>"}i+=c,$commentsCont.append(e),$commentsCount.html(a),i>=a&&($.detachInfiniteScroll($(".infinite-scroll")),$(".infinite-scroll-preloader").remove())}else $.alert(t.msg)},error:function(){$.alert("不好意思，出错了~~")}})}function n(t){var n="";t&&(n="回复"+t+"：");var o='<div class="list-block"><textarea id="reply">'+n+'</textarea></div><div class="self-modal-btn"><span class="self-modal-button button-lines" id="cancel">取消</span><span class="self-modal-button" id="determine">确定</span></div>';setTimeout(function(){var n=$.modal({text:o});$("#cancel").on("click",function(){$.closeModal(n),$(".modal-overlay").remove()}),$("#determine").on("click",function(){var o=$("#reply").val();return o?t&&5==o.length?($.toast("请输入回复内容"),!1):void $.ajax({url:api+"/notice/commentAdd",type:"POST",data:{id:c,content:o,mobile:13418490922},dataType:"json",success:function(o){"1000"==o.code&&(t?$.toast("回复成功"):$.toast("评论成功"),$commentsCont.empty(),l=1,e(),$.closeModal(n),$(".modal-overlay").remove())}}):($.toast("请输入评论内容"),!1)})},100)}function o(t){return t?t.replace(/[<>&"]/g,function(t){return{"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[t]}):""}$title=$("#title"),$subTitle=$("#subTitle"),$content=$("#content"),$comment=$("#comment"),$comments=$("#comments"),$commentsCount=$("#commentsCount"),$commentsCont=$("#commentsCont"),$noData=$("#noData");var a,c,i=0,s=!1,l=1;$(document).on("click",".js-reply",function(){var t=$(this),e=t.data("name");n(e)}),$(document).on("click","#comment",function(){n()}),$.init(),t()});