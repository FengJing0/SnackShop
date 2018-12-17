<?php

namespace app\api\model;


class UserAddress extends BaseModel
{
    protected $hidden = ['delete_time','id','user_id','update_time'];
}