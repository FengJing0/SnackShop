<?php

namespace app\api\model;


class Order extends BaseModel
{
    protected $hidden = ['user_id','delete_time','update_time'];

    public function getSnapItemsAttr($value,$data){
        return empty($value) ? null :json_decode($value);
    }

    public function getSnapAddressAttr($value,$data){
        return empty($value) ? null :json_decode($value);
    }

    public static function getSummaryByUser($uid, $page = 1, $size = 15){
        return self::where('user_id','=',$uid)
            ->order('create_time desc')
            ->paginate($size,false,['page' => $page]);
    }

    public static function getSummaryByPage($page=1,$size=15){
        return self::order('create_time desc')
            ->paginate($size,false,['page'=>$page]);
    }
}