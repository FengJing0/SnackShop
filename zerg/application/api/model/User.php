<?php

namespace app\api\model;


class User extends BaseModel
{
    protected $hidden = ['delete_time','update_time','create_time'];

    public function address(){
        return $this->hasOne('UserAddress','user_id','id');
    }

    public static function getByOpenID($openid){
        return self::where('openid','=',$openid)->find();
    }
}