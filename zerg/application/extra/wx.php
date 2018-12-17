<?php

return [
    'app_id' => '你的appid',
    'app_secret' => '你的app_secret',
    'login_url' => 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
    'key' => '你的key',
    'mch_id' => '你的商户号',
    'notify_url'=>'http://z.cn/api/v1/pay/notify',
    'access_token_url' => 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s'
];