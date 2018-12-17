<?php

namespace app\lib\exception;


class PayException extends BaseException
{
    public $code = 403;
    public $msg = '创建支付失败';
    public $errorCode = 40000;
}