<?php

namespace app\api\model;

use think\Db;
use think\Model;

class Banner extends Model
{
    protected $hidden = ['delete_time','update_time'];

    public function items(){
        return $this->hasMany('BannerItem','banner_id','id');
    }

    /**
     * @param $id
     * @return mixed
     */
    public static function getBannerById($id){
        $banner = self::with(['items','items.img'])->find($id);

        return $banner;



//        $result = Db::query('select * from banner_item where banner_id=?',[$id]);

//        $result = Db::table('banner_item')->where('banner_id','=', $id)->select();


//        $result = Db::table('banner_item')
//            ->where(function($query)use($id){
//                $query->where('banner_id','=',$id);
//            })
//            ->select();
//        return $result;
    }
}