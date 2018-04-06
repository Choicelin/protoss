import { Base } from '../util/base.js'

class Home extends Base {

    /**
     * 根据id获取Banner数据
     * @params:
     * id {int} BannerID
     * callback {function} 回掉函数
     */
    getBannerData(id, callback) {
        var params = {
            url: 'banner/' + id,
            sCallback: function(res) {
                callback && callback(res.items);
            }
        }
        this.request(params);
    }

    /**
     * 获取Theme数据
     * @params:
     * callback {function} 回掉函数
     */
    getThemeData(callback) {
        var params = {
            url: 'theme/list?ids=1,2,3',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }

    /**
     * 获取最新商品信息
     * params:
     * callback {function} 回掉函数
     */
    getProductsData(callback) {
        var params = {
            url: 'product/recent?count=15',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.request(params);
    }

}

export {Home}