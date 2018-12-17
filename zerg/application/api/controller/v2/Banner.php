<?php

namespace app\api\controller\v2;

use app\api\validate\IDMustBePositiveInt;
use app\api\model\Banner as BannerModel;
use app\lib\exception\BannerMissException;

class Banner
{
    /**
     * 获取指定的banner信息
     * @url /banner/:id
     * @http GET
     * @$id banner的id号
     */
    public function getBanner($id){
//        (new IDMustBePositiveInt())->goCheck();
////        $banner = BannerModel::with(['items','items.img'])->find($id);
//        $banner = BannerModel::getBannerById($id);
//        if(!$banner){
//            throw new BannerMissException();
//        }
//        return $banner;
        return 'This is V2';
    }
}