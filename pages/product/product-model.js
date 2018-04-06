import {Base} from '../util/base.js'

class Product extends Base {

    /**
     * 获取商品详情信息
     * @params:
     * id {int} 商品id
     * callback {function} 回掉函数
     */
    getDetailInfo(id, callback) {
        var params = {
            url: 'product/' + id,
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }
}

export {Product}