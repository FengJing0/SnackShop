<?php

namespace app\api\service;
use app\api\model\User;
use app\lib\exception\OrderException;
use app\lib\exception\UserException;

class DeliveryMessage extends WxMessage
{
    const DELIVERY_MSG_ID='';

    public function sendDeliveryMessage($order,$tplJumpPage=''){
        if(!$order){
            throw new OrderException();
        }

        $this->tplID = self::DELIVERY_MSG_ID;
        $this->formID=$order->prepay_id;
        $this->page = $tplJumpPage;
        $this->prepareMessageData($order);
        $this->emphasisKeyWord = 'keyword2.DATA';
        return parent::sendMessage($this->getUserOpenID($order->user_id));
    }

    private function prepareMessageData($order){
        $dt = new \DateTime();
        $data = [
            'keyword1'=>[
                'value' => '顺丰快递'
            ],
            'keyword2'=>[
                'value' => $order->snap_name,
                'color' => '#274088'
            ],
            'keyword3'=>[
                'value' => $order->order_no
            ],
            'keyword4'=>[
                'value' => $dt->format('Y-m-d H:1')
            ]
        ];
        $this->data = $data;
    }

    private function getUserOpenID($uid)
    {
        $user = User::get($uid);
        if (!$user) {
            throw new UserException();
        }
        return $user->openid;
    }
}