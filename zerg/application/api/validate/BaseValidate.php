<?php

namespace app\api\validate;

use app\lib\exception\ParameterException;
use think\Validate;
use think\Request;

class BaseValidate extends Validate
{
    public function goCheck(){
        $request = Request::instance();
        $params = $request->param();

        $result = $this->batch()->check($params);
        if(!$result){
            $e = new ParameterException([
                'msg' => $this->error,
            ]);
            throw $e;
        }else{
            return true;
        }
    }

    public function getDataByRule($arrays){
        if(array_key_exists('user_id',$arrays)|array_key_exists('uid',$arrays)){
            throw new ParameterException([
                'msg' => '参数中包含非法的参数名user_id或uid'
            ]);
        }

        $newArray = [];

        foreach ($this->rule as $key => $value){
            $newArray[$key] = $arrays[$key];
        }
        return $newArray;
    }

    protected function isPositiveInteger($value , $rule='', $data = '', $field = ''){
        if(is_numeric($value) && is_int($value + 0) && ($value + 0) > 0){
            return true;
        }else{
            return false;
        }
    }

    protected function isNotEmpty($value){
        return !empty($value);
    }

    protected function isMobile($value){
        $rule1 = '^1(3|4|5|7|8)[0-9]\d{8}$^';
        $rule2 = '^\d{3}-\d{8}|\d{4}-\{7,8}$^';
        if(preg_match($rule1,$value)||preg_match($rule2,$value)){
            return true;
        }else{
            return false;
        }
    }
}