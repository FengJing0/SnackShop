<?php

namespace app\lib\exception;


class ThemeException extends BaseException
{
    public $code = 404;
    public $msg = '指定主题不存在，请检测主题ID';
    public $errorCode = 30000;
}