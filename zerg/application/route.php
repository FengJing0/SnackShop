<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\Route;

Route::get('/','api/v2.Test/index');

Route::get('api/:version/banner/:id','api/:version.Banner/getBanner');


Route::get('api/:version/theme','api/:version.Theme/getSimpleList');
Route::get('api/:version/theme/:id','api/:version.Theme/getComplexOne');


//Route::get('api/:version/product/:id','api/:version.Product/getOne',[],['id'=>'\d+']);
//Route::get('api/:version/product/recent','api/:version.Product/getRecent');
//Route::get('api/:version/product/by_category','api/:version.Product/getAllInCategory');

Route::group('api/:version/product',function(){
    Route::get('/by_category','api/:version.Product/getAllInCategory');
    Route::get('/recent','api/:version.Product/getRecent');
    Route::get('/:id','api/:version.Product/getOne',[],['id'=>'\d+']);
});


Route::get('api/:version/category/all','api/:version.Category/getAllCategories');



Route::group('api/:version/token',function(){
    Route::post('/user','api/:version.Token/getToken');
    Route::post('/app','api/:version.Token/getAppToken');
    Route::post('/verify','api/:version.Token/verifyToken');
});
//Route::post('api/:version/token/user','api/:version.Token/getToken');
//Route::post('api/:version/token/app','api/:version.Token/getAppToken');
//Route::post('api/:version/token/verify','api/:version.Token/verifyToken');


Route::post('api/:version/address','api/:version.Address/createOrUpdateAddress');
Route::get('api/:version/address','api/:version.Address/getUserAddress');


Route::group('api/:version/order',function(){
    Route::post('','api/:version.Order/placeOrder');
Route::get('/:id','api/:version.Order/getDetail',[],['id'=>'\d+']);
Route::get('/by_user','api/:version.Order/getSummaryByUser');
Route::get('/paginate','api/:version.Order/getSummary');
Route::put('/delivery','api/:version.Order/delivery');
});

//Route::post('api/:version/order','api/:version.Order/placeOrder');
//Route::get('api/:version/order/:id','api/:version.Order/getDetail',[],['id'=>'\d+']);
//Route::get('api/:version/order/by_user','api/:version.Order/getSummaryByUser');


Route::post('api/:version/pay/pre_order','api/:version.Pay/getPreOrder');
Route::post('api/:version/pay/notify','api/:version.Pay/receiveNotify');


Route::post('api/:version/user','api/:version.User/getInfo');


