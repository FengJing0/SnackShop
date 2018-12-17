<?php

namespace app\api\service;


use app\api\model\OrderProduct;
use app\api\model\Product;
use app\api\model\UserAddress;
use app\api\model\Order as OrderModel;
use app\lib\enum\OrderStatusEnum;
use app\lib\exception\OrderException;
use app\lib\exception\UserException;
use think\Db;
use think\Exception;

class Order
{
    // 客户端传递的products参数
    protected $oProducts;

    // 真实的商品信息（包括库存）
    protected $Products;

    protected $uid;

    public function place($uid, $oProducts){
        $this->oProducts = $oProducts;
        $this->Products = $this->getProductsByOrder($oProducts);
        $this->uid = $uid;
        $status =  $this->getOrderStatus();
        if(!$status['pass']){
            $status['order_id'] = -1;
            return $status;
        }

        // 开始创建订单
        $orderSnap = $this->snapOrder($status);
        $order = $this->createOrder($orderSnap);
        $order['pass'] = true;
        return $order;
    }

    private function createOrder($snap){
        Db::startTrans();
        try{
            $orderNo = self::makeOrderNo();
            $order = new \app\api\model\Order();
            $order->user_id = $this->uid;
            $order->order_no = $orderNo;
            $order->total_price = $snap['orderPrice'];
            $order->total_count = $snap['totalCount'];
            $order->snap_img = $snap['snapImg'];
            $order->snap_name = $snap['snapName'];
            $order->snap_address = $snap['snapAddress'];
            $order->snap_items = json_encode($snap['pStatus']);

            $order->save();

            $orderID = $order->id;
            $create_time = $order->create_time;

            foreach ($this->oProducts as &$p){
                $p['order_id'] = $orderID;
            }

            $orderProduct = new OrderProduct();

            $orderProduct->saveAll($this->oProducts);

            Db::commit();

            return [
                'order_no' => $orderNo,
                'order_id' => $orderID,
                'create_time' => $create_time
            ];
        } catch (Exception $e){
            Db::rollback();
            throw $e;
        }

    }

    public static function makeOrderNo(){
        $yCode = array('A','B','C','D','E','F','G','H','I','J');
        $orderSn = $yCode[intval(date('Y'))-2018].strtoupper(dechex(date('m'))).Date('Ymd').substr(time(),-5).substr(microtime(),2,5).sprintf('%02d',rand(0,99));
        return $orderSn;
    }

    private function snapOrder($status){
        $snap = [
            'orderPrice' => 0,
            'totalCount' => 0,
            'pStatus' => [],
            'snapAddress' => null,
            'snapName' => '',
            'snapImg' => '',
        ];

        $snap['orderPrice'] = $status['orderPrice'];
        $snap['totalCount'] = $status['totalCount'];
        $snap['pStatus'] = $status['pStatusArray'];
        $snap['snapAddress'] = json_encode($this->getUserAddress());
        $snap['snapName'] = $this->Products[0]['name'];
        $snap['snapImg'] = $this->Products[0]['main_img_url'];

        if(count($this->Products)>1){
            $snap['snapName'] .=' 等';
        }
        return $snap;
    }

    private function getUserAddress(){
        $userAddress = UserAddress::where('user_id','=',$this->uid)->find();
        if(!$userAddress){
            throw new UserException([
                'msg' => '用户收货地址不存在，下单失败',
                'errorCode' => 60001
            ]);
        }
        return $userAddress->toArray();
    }

    public function checkOrderStock($orderID){
        $oProducts = OrderProduct::where('order_id','=',$orderID)->select();
        $this->oProducts = $oProducts;

        $this->Products = $this->getProductsByOrder($oProducts);

        return $this->getOrderStatus();
    }

    private function getOrderStatus(){
        $status = [
            'pass' => true,
            'orderPrice' => 0,
            'totalCount' => 0,
            'pStatusArray' => []
        ];

        foreach ($this->oProducts as $oProduct){
            $pStatus = $this->getProductsStatus($oProduct['product_id'],$oProduct['count'],$this->Products);
            if(!$pStatus['haveStock']){
                $status['pass'] = false;
            }
            $status['orderPrice'] += $pStatus['totalPrice'];
            $status['totalCount'] += $pStatus['counts'];
            array_push($status['pStatusArray'],$pStatus);
        }

        return $status;
    }

    private function getProductsStatus($oPID,$oCount,$products){
        $pIndex = -1;
        $pStatus = [
            'id' => null,
            'haveStock' => false,
            'counts' => 0,
            'price' => 0,
            'name' => '',
            'totalPrice' => 0,
            'main_img_url' => null
        ];

        for($i=0;$i<count($products);$i++){
            if($oPID==$products[$i]['id']){
                $pIndex = $i;
            }
        }

        if($pIndex==-1){
            throw new OrderException([
                'msg' => 'id为'.$oPID.'的商品不存在，创建订单失败'
            ]);
        }else{
            $product = $products[$pIndex];
            $pStatus['id'] = $product['id'];
            $pStatus['name'] = $product['name'];
            $pStatus['price'] = $product['price'];
            $pStatus['counts'] = $oCount;
            $pStatus['totalPrice'] = $oCount * $product['price'];
            $pStatus['main_img_url'] =  $product['main_img_url'];
            $pStatus['haveStock'] = $product['stock'] - $oCount >= 0;
        }
        return $pStatus;
    }

    private function getProductsByOrder($oProducts){
        $oPIDs = [];
        foreach ($oProducts as $item){
            array_push($oPIDs, $item['product_id']);
        }

        $products = Product::all($oPIDs)
            ->visible(['id','price','stock','name','main_img_url'])
            ->toArray();

        return $products;
    }

    public function delivery($orderID,$jumpPage = ''){
        $order = OrderModel::where('id','=',$orderID)->find();

        if(!$order){
            throw new OrderException();
        }

        if($order->status != OrderStatusEnum::PAID){
            throw new OrderException([
               'msg' => '未付款',
               'errorCode' => 80002,
               'code' => 403
            ]);
        }

        $order->status = OrderStatusEnum::DELIVERED;
        $order->save();

        $message = new DeliveryMessage();
        return $message->sendDeliveryMessage($order,$jumpPage);
    }
}