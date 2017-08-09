/**
 * Created by gsy on 2016/11/8.
 */
angular
    .module('jhipsterSampleApplicationApp')
    .controller('DataLabelController2',DataLabelController2);

DataLabelController2.$inject = ['$scope', '$http', '$state', '$injector','dataLabelservice','Submitservice','Initservice'];
function DataLabelController2($scope, $http, $state,$injector, dataLabelservice,Submitservice,Initservice) {
    $scope.run = run;
    $scope.submit=submit;
    $scope.jump=jump;
    $scope.keywords="";
    $scope.selectdb=false;
    $scope.dbname="";
    $scope.selectsina=false;
    $scope.selecttime=false;
    $scope.timestart="";
    $scope.timeend="";
    $scope.writedb="";
    $scope.oldlabel="";
    $scope.newlabel="";
    $scope.selectoldlabel=true;
    $scope.selectkey=false;
    $scope.nodbname=false;
    $scope.notag=false;
    $scope.nokey=false;
    $scope.wait_show=false;
    $scope.items=[];
    $scope.jump_page="";
    $scope.type=0;
    var page=0;
    var text="";
    $scope.labels=[];
    var perpage=10;
    var element = $('#page');
    var totalPages=0;
    var options=null;
//    $('#myModal').modal({keyboard:false,backdrop:'static',show:false});
//    $('#waitModal').modal({keyboard:false,backdrop:'static',show:false});
//    $('#waitModal').modal('hide');
//    $('#myModal').modal('hide');
    $injector.get('$templateCache').removeAll();
    console.log('33333333333333333333333');

    get_init();
    /**
         向后台请求初始化参数
     */
    function get_init()
    {
        Initservice.get({},function success(result)
        {
            for(i in result.all_label)
            {
                label=result.all_label[i];
                $scope.labels.push(label);
           }


        },function failure(result){})
    }

    /**
         接收到后台传来的微博数据后，前端进行分页展示
     */
    function show_content(result)
    {

        $scope.dataset=result.dataset;
        $scope.len = result.dataset.length;
        $scope.choose = new Array($scope.len);
        for(x in result.dataset){
            var id= result.dataset[x].since_id;
            $scope.choose[id]=false;
        }
        console.log($scope.choose);
        totalPages=Math.ceil($scope.len / perpage);
        if(totalPages<1)//不能为0
            totalPages=1;
        $scope.items=[]
        options = {
                             bootstrapMajorVersion:3,
                             currentPage: 1,
                             numberOfPages: perpage,
                             totalPages:totalPages,
                             /**
                                  翻页点击回调函数
                             */
                             onPageClicked: function(e,originalEvent,type,page)
                             {
            //                      $('#123').text("Page item clicked page: "+page);
                                  for(i in $scope.items)
                                  {
                                    var test=$scope.items[i].since_id;

                                   $scope.choose[$scope.items[i].since_id]=document.getElementById(test).checked;
                                   console.log(document.getElementById(test).checked+" "+$scope.choose[$scope.items[i].since_id]);
                                  }
                                  var start=(page-1)*perpage;
                                  var end = page*perpage;
                                  if(end>$scope.len)
                                  {
                                    end=$scope.len;
                                  }
            //                      .items=new Array(end-start);
                                  $scope.items=[];
                                  for(var i =start;i<end;i++)
                                  {
                                        $scope.items[i-start]=$scope.dataset[i];

                                  }

                                  console.log($scope.items);

//                                      document.getElementById("get_content").innerHTML="";
                                  text="";
                                  for(i in $scope.items)
                                  {

                                    text+="<div style=\"margin-top:10px;margin-bottom:10px;position: relative;display: block;\" ><input type=\"checkbox\" id=\""+$scope.items[i].since_id+"\">&nbsp"+$scope.items[i].weibo_content+"</div>";


                                  }
                                  $("#get_content").html(text);
                                  for(i in $scope.items)
                                  {
                                        var test=$scope.items[i].since_id;
                                        document.getElementById(test).checked=$scope.choose[$scope.items[i].since_id];
                                        console.log($scope.items[i].since_id+" "+$scope.choose[$scope.items[i].since_id]+" "+document.getElementById(test).checked);
                                  }

                             }
                        }

             element.bootstrapPaginator(options);
             options.onPageClicked("","","",1);




    }

    /**
     * 点击搜索按钮后触发，向后台请求微博数据
     */
    function run() {
        if(!checkparam())
        {
            return;
        }
        $('#waitModal').modal('show');
        $('#myModal').modal('hide');
        dataLabelservice.get({keywords:$scope.keywords,selectkey:$scope.selectkey,dbname:$scope.dbname,selecttime:$scope.selecttime,timestart
        :$scope.timestart,timeend:$scope.timeend,selectoldlabel:$scope.selectoldlabel,oldlabel:$scope.oldlabel,newlabel:$scope.newlabel,type:$scope.type,page:0}, function success(result) {
            $('#waitModal').modal('hide');
            $('#myModal').modal('show');

            console.log(result);
            page=result.page;
            show_content(result);
            if(result.response_code==1)
                alert("已经是最后一页了！");

        },function failure() {
            $('#waitModal').modal('hide');
            $('#myModal').modal('show');
            var result=new Array();
            result["dataset"]=[];
            show_content(result);
            //为什么没有立即刷新
            alert("服务器发生未知错误");
        });
    }

    /**
     * 点击提交后触发，向后台提交微博标注的结果，并接收下一批数据
     */
    function submit(){
        $state.go('dataLabel_db', null, { reload: true });
        var postdata=new Array();
         for(i in $scope.items)
          {
            var test=$scope.items[i].since_id;

            $scope.choose[$scope.items[i].since_id]=document.getElementById(test).checked;
          }

        for(var i in $scope.dataset)
        {

            var item=$scope.dataset[i];
            if($scope.choose[item.since_id])
            {
                   postdata.push(item.since_id) ;
            }
        }
        $('#waitModal').modal('show');
        $('#myModal').modal('hide');
        Submitservice.get({labelresult:postdata,keywords:$scope.keywords,selectkey:$scope.selectkey,dbname:$scope.dbname,selecttime:$scope.selecttime,timestart
        :$scope.timestart,timeend:$scope.timeend,selectoldlabel:$scope.selectoldlabel,oldlabel:$scope.oldlabel,newlabel:$scope.newlabel,type:$scope.type,page:page}, function success(result) {
        $('#waitModal').modal('hide');
        $('#myModal').modal('show');
        console.log(result);

        if(result.response_code==-1)
        {
            alert("数据库写入发生错误，成功写入"+result.success_count+"条！");
        }
        else{
            alert("写入成功，写入"+result.success_count+"条！");
            page=result.page;
            if(result.response_code==1)
                alert("已经是最后一页了！");
            show_content(result);
        }
         },function () {
         $('#waitModal').modal('hide');
         $('#myModal').modal('show');
         alert("服务器发生未知错误");
         });

    }

    /**
     * 参数检查
     */
    function checkparam()
    {

        if(!$scope.dbname)
        {
            $scope.nodbname=true;
        }
        else{
            $scope.nodbname=false;
        }
        if($scope.type)//数据库搜索页
        {
            if($scope.selectkey&&!$scope.keywords)
            {
                $scope.nokey=true;
            }
            else{
                $scope.nokey=false;
            }
        }
        else{//新浪搜索页
            if(!$scope.keywords)
            {
               $scope.nokey=true;
             }
             else{
                $scope.nokey=false;
             }
        }
        if(!$scope.oldlabel && $scope.selectoldlabel || !$scope.newlabel && !$scope.selectoldlabel)
        {
            $scope.notag=true;
         }
         else{
            $scope.notag=false;
         }

        if($scope.notag||$scope.nokey||$scope.nodbname)
        {
            return false;
         }
        else{
            return true;
        }
    }

/**
     * 页面跳转
     */
    function jump()
    {

        if($scope.jump_page!="")
            if(!isNaN($scope.jump_page))
            {
                var p = parseInt($scope.jump_page);
                if(p>totalPages)
                {
                    p=totalPages
                }
                if(p<1)
                {
                    p=1;
                }
                $('#page').bootstrapPaginator("show",p);//只改变页码，但是没有改变页面内容，没有出发回调函数
                options.onPageClicked("","","",p);
             }
    }

/**
     * 解决bootstrap中多模态框背景遮罩增多，导致背景的颜色越来越深的问题
     */
    $(document).on('show.bs.modal', '.modal', function(event) {
            $(this).appendTo($('body'));
        }).on('shown.bs.modal', '.modal.in', function(event) {
            setModalsAndBackdropsOrder();
        }).on('hidden.bs.modal', '.modal', function(event) {
            setModalsAndBackdropsOrder();
        });


        function setModalsAndBackdropsOrder() {
            var modalZIndex = 1040;
            $('.modal.in').each(function(index) {
                var $modal = $(this);
                modalZIndex++;
                $modal.css('zIndex', modalZIndex);
                $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
            });
            $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
        }

/**
     * 解决bootstrap中多模态框滑动条滑动主页而不是模态框的问题
     */
        $.fn.modal.Constructor.prototype.hideModal = function () {
                var that = this;
                this.$element.hide();
                this.backdrop(function () {
                    //判断当前页面所有的模态框都已经隐藏了之后body移除.modal-open，即body出现滚动条。
                    $('.modal.fade.in').length === 0 && that.$body.removeClass('modal-open');
                    that.resetAdjustments();
                    that.resetScrollbar();
                    that.$element.trigger('hidden.bs.modal');
                })
            }
}