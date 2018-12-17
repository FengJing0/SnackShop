<?php

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\validate\IDMustBePositiveInt;
use app\api\validate\OrderPlace;
use app\api\service\Token as TokenService;
use app\api\service\Order as OrderService;
use app\api\model\Order as OrderModel;
use app\api\validate\PagingParameter;
use app\lib\exception\OrderException;
use app\lib\exception\SuccessMessage;

class Order extends BaseController
{
    protected $beforeActionList = [
        'checkExclusiveScope' => ['only'=>'placeOrder'],
        'checkPrimaryScope' => ['only'=>'getSummaryByUser,getDetail'],
    ];



    public function getSummaryByUser($page = 1,$size = 15){
        (new PagingParameter())->goCheck();
        $uid = TokenService::getCurrentUid();
        $pagingOrders = OrderModel::getSummaryByUser($uid,$page,$size);
        if($pagingOrders->isEmpty()){
            return [
                'data' => [],
                'total' => $pagingOrders->total(),
                'current_page' => $pagingOrders->getCurrentPage(),
            ];
        }
        return $pagingOrders->toArray();
    }

    public function getDetail($id){
        (new IDMustBePositiveInt())->goCheck();
        $orderDetail = OrderModel::get($id);
        if(!$orderDetail){
            throw new OrderException();
        }
        return $orderDetail->hidden(['prepay_id']);
    }

    public function placeOrder(){
        (new OrderPlace())->goCheck();
        $products = input('post.products/a');
        $uid = TokenService::getCurrentUid();

        $order = new OrderService();
        return $order->place($uid,$products);
    }

    public function getSummary($page = 1, $size = 15){
        (new PagingParameter())->goCheck();
        $pagingOrder = OrderModel::getSummaryByPage($page,$size);
        if($pagingOrder->isEmpty()){
            return [
                'current_page' =>$pagingOrder->currentPage(),
                'data'=>[],
                'total' => $pagingOrder->total(),
            ];
        }
        return $pagingOrder->hidden(['snap_item','snap_address'])->toArray();
    }

    public function delivery($id){
        (new IDMustBePositiveInt())->goCheck();
        $order = new OrderService();
        $success = $order->delivery($id);
        if($success){
            return new SuccessMessage();
        }
    }
}