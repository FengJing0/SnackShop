<?php

namespace app\api\model;

class Product extends BaseModel
{
    protected $hidden = ['delete_time','update_time','create_time','from','pivot'];

    public function getMainImgUrlAttr($value,$data){
        return $this->prefixImgUrl($value,$data);
    }

    public function imgs(){
        return $this->hasMany('ProductImage','product_id','id');
    }

    public function properties(){
        return $this->hasMany('ProductProperty','product_id','id');
    }

    public static function getMostRecent($count){
        return self::limit($count)->order('create_time',' desc')->select();
    }

    public static function getProductsByCategoryID($categoryID){
        return self::where('category_id','=',$categoryID)->select();
    }

    public static function getProductDetail($id){
        return self::with(['properties'])->with([
            'imgs' => function($query){
                $query->with(['imgUrl'])->order('order','asc');
            }
        ])->find($id);
    }
}