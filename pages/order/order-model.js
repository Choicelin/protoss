import { Base } from '../../pages/util/base.js'

class Order extends Base {

    constructor() {
        super();
        this._storageKeyName = 'newOrder';
    }

    /*下订单*/
    doOrder(param, callback) {
        var that = this;
        var allParams = {
            url: 'order',
            type: 'post',
            data: param,
            sCallback: function (data) {
                that.execSetStorageSync(true);
                callback && callback(data);
            },
            eCallback: function () {
            }
        };
        this.request(allParams);
    }

    /**
     * 拉起微信支付
     * params:
     * norderNumber - {int} 订单id
     * return：
     * callback - {obj} 回调方法 ，返回参数 
     * 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
     */
    execPay(oid, callback) {
        var allParams = {
            url: 'pay/pre_pay',
            type: 'post',
            data: {
                oid: oid
            },
            sCallback: function (data) {
                let wxData = data.data;
                let timeStamp = wxData.timeStamp;
                if (timeStamp) { //可以支付
                    wx.requestPayment({
                        'timeStamp': timeStamp,
                        'nonceStr': wxData.nonceStr,
                        'package': wxData.package,
                        'signType': wxData.signType,
                        'paySign': wxData.paySign,
                        success: function (res) {
                            callback && callback(2);
                        },
                        fail: function (res) {
                            console.log(res)
                            callback && callback(1);
                        }
                    });
                } else {
                    callback && callback(0);
                }
            }
        };
        this.request(allParams);
    }

    /*获得所有订单,pageIndex 从1开始*/
    getOrders(pageIndex, callback) {
        var allParams = {
            url: 'order/by_user',
            data: {
                page: pageIndex,
                size: 5
            },
            type: 'get',
            sCallback: function (data) {
                callback && callback(data);  //1 未支付  2，已支付  3，已发货，4已支付，但库存不足
            }
        };
        this.request(allParams);
    }

    /*获得订单的具体内容*/
    getOrderInfoById(id, callback) {
        var that = this;
        var allParams = {
            url: 'order/' + id,
            sCallback: function (data) {
                callback && callback(data);
            },
            eCallback: function () {

            }
        };
        this.request(allParams);
    }

    /*本地缓存 保存／更新*/
    execSetStorageSync(data) {
        wx.setStorageSync(this._storageKeyName, data);
    };

    /*是否有新的订单*/
    hasNewOrder() {
        var flag = wx.getStorageSync(this._storageKeyName);
        return flag == true;
    }

}

export { Order };