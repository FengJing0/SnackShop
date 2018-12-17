<?php

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\validate\IDMustBePositiveInt;
use app\api\service\Pay as PayService;
use app\api\service\WxNotify;

class Pay extends BaseController
{
    protected $beforeActionList = [
        'checkExclusiveScope' => ['only'=>'getPreOrder'],
    ];

    public function getPreOrder($id = ''){
//        (new IDMustBePositiveInt())->goCheck();
        $pay = new PayService($id);
        return $pay->pay();
    }

    public function receiveNotify(){
        $notify = new WxNotify();
        $notify->Handle(null);
    }
}