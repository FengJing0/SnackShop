<?php

namespace app\api\controller;


use think\Controller;
use app\api\service\Token as TokenService;

class BaseController extends Controller
{
    // php think optimize:schema
    // php think optimize:route

    // 用户和管理员都能访问
    protected function checkPrimaryScope(){
        TokenService::needPrimaryScope();
    }

    // 只能用户访问
    protected function checkExclusiveScope(){
        TokenService::needExclusiveScope();
    }
}