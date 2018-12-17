<?php

namespace app\api\controller\v2;

use app\lib\config\WxPayConfig;

class Test
{
    public function index(){
        $config = new WxPayConfig();
        return $config->GetAppId();
//        return WxPayConfig::index();
    }
}