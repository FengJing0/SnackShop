<?php


namespace app\api\controller\v1;


use app\api\validate\Count;
use app\api\model\Product as ProductModel;
use app\api\validate\IDMustBePositiveInt;
use app\lib\exception\ProductException;

class Product
{
    public function getRecent($count = 10){
        (new Count())->goCheck();
        $result = ProductModel::getMostRecent($count);
        if($result->isEmpty()){
            throw new ProductException();
        }
        $result = $result->hidden(['summary']);
        return $result;
    }

    public function getAllInCategory($id){
        (new IDMustBePositiveInt())->goCheck();
        $result = ProductModel::getProductsByCategoryID($id);
        if($result->isEmpty()){
            throw new ProductException();
        }
        $result = $result->hidden(['summary']);
        return $result;
    }

    public function getOne($id){
        (new IDMustBePositiveInt())->goCheck();
        $product = ProductModel::getProductDetail($id);
        if(!$product){
            throw new ProductException();
        }
        return $product;
    }

    public function deleteOne($id){

    }
}