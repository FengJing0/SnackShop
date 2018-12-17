<?php

namespace app\api\controller\v1;

use think\Loader;
use app\api\service\Token as TokenService;

Loader::import('WxEncode.wxBizDataCrypt',EXTEND_PATH,'.php');
class User
{
    public function getInfo($encryptedData='',$iv=''){
        $appid = config('wx.app_id');
        $sessionKey = TokenService::getCurrentTokenVar('session_key');
        $data = null;

        $pc = new \WXBizDataCrypt($appid, $sessionKey);
        $errCode = $pc->decryptData($encryptedData, $iv, $data );

        if ($errCode == 0) {
            return json_decode($data);
        } else {
            return $errCode;
        }
    }
}