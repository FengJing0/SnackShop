<?php

namespace app\api\model;

use think\Model;

class BaseModel extends Model
{
    protected $autoWriteTimestamp = true;
    protected function prefixImgUrl ($value,$data){
        return $data['from']===1?config('setting.img_prefix').$value:$value;
    }
}
