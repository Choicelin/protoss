import {Base} from '../util/base.js'

class Theme extends Base {

    /**
     * 获取对应主题的商品列表
     * @params:
     * id {int} 商品id
     * callback {function} 回掉函数
     */
    getProductsData(id, callback) {
        var params = {
            url: 'theme/' + id,
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }

}

export {Theme}