import {Base} from '../util/base.js'

class Category extends Base {

    /**
     * 获取商品分类信息
     * @params:
     * callback {function} 回掉函数
     */
    getCategoryType(callback) {
        var params = {
            url: 'category/all',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }

    /**
     * 根据分类获取商品列表
     * @params:
     * id {int} 商品分类id
     * callback {function} 回掉函数
     */
    getProductsByCategory(id, callback) {
        var params = {
            url: 'product/by_category?id=' + id,
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }
}

export {Category}