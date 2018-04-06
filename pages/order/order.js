import {Cart} from '../cart/cart-model.js'
import {Address} from '../util/address.js'
import {Order} from './order-model.js'

let cart = new Cart();
let address = new Address();
let order = new Order();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 订单商品列表 */
        productsArr: [],
        /** 订单商品的总价格 */
        account: 0,
        /** 订单状态 */
        orderStatus: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.from == 'cart') {
            this._fromCart(options.account);
        }
        if (options.from == 'order') {
            this.setData({
                id: options.id
            });
        }
    },

    _fromCart: function(account) {
        var productsArr = cart.getCartDataFromLocal();
        //过滤掉未选择的商品
        productsArr = productsArr.filter(function (product) {
            if (product.selectStatus) {
                return product;
            }
        });
        this.setData({
            productsArr: productsArr,
            account: account,
            orderStatus: 0
        });

        address.getAddress((res) => {
            this._bindAddressInfo(res);
        });
    },

    onShow: function () {
        if (this.data.id) {
            var that = this;
            //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
            var id = this.data.id;
            order.getOrderInfoById(id, (data) => {
                that.setData({
                    orderStatus: data.status,
                    productsArr: data.items,
                    account: data.totalPrice,
                    basicInfo: {
                        orderTime: that._dateFormat(new Date(data.createTime)),
                        orderNo: data.orderNo
                    },
                });

                // 快照地址
                var addressInfo = data.address;
                addressInfo.totalDetail = address.setAddressInfo(addressInfo);
                that._bindAddressInfo(addressInfo);
            });
        }
    },

    /**
     * 修改或添加收货地址
     */
    editAddress: function() {
        let that = this;
        wx.chooseAddress({
            success: function(res) {
                let addressInfo = {
                    name: res.userName,
                    mobile: res.telNumber.replace('-',''),
                    totalDetail: address.setAddressInfo(res)
                };

                that._bindAddressInfo(addressInfo);

                //保存地址
                address.submitAddress(res, (flag) => {
                    if (!flag) {
                        that.showTips('操作提示', '地址信息更新失败！');
                    }
                });
            }
        })
    },

    /**
     * 绑定地址信息
     */
    _bindAddressInfo: function(addressInfo) {
        this.setData({
            addressInfo: addressInfo
        });
    },

    /**
     * 下单和付款
     */
    pay: function () {
        if (!this.data.addressInfo) {
            this.showTips('下单提示', '请填写您的收货地址');
            return;
        }
        if (this.data.orderStatus == 0) {
            this._firstTimePay();
        } else {
            this._oneMoresTimePay();
        }
    },

    /**
     * 第一次支付
     */
    _firstTimePay: function() {
        let orderInfo = [],
            productInfo = this.data.productsArr,
            order = new Order();
        
        for (let i = 0; i < productInfo.length; i++) {
            orderInfo.push({
                productId: productInfo[i].id,
                count: productInfo[i].counts
            });
        }

        //支付分两步, 第一步生成订单号, 第二步根据订单号支付
        let that = this;
        order.doOrder(orderInfo, (data) => {
            //订单生成成功
            if (data.success) {
                //更新订单状态
                let id = data.data.id;
                that.setData({
                    id: id,
                    fromCartFlag: false
                });
                //开始支付
                that._execPay(id);
            } else {
                that._orderFail(data);
            }
        });
    },

    /**
     * 开始支付
     * params:
     * id {int} 订单id
     */
    _execPay: function (id) {
        if (!order.onPay) {
            //屏蔽支付，提示
            this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true);
            //将已经下单的商品从购物车删除
            this.deleteProducts();
            return;
        }
        var that = this;
        order.execPay(id, (statusCode) => {
            if (statusCode != 0) {
                that.deleteProducts();

                var flag = statusCode == 2;
                wx.navigateTo({
                    url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
                });
            }
        });
    },

    /**
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
    showTips: function (title, content, flag) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: function (res) {
                if (flag) {
                    wx.switchTab({
                        url: '/pages/my/my'
                    });
                }
            }
        });
    },

    /**
     * 下单失败
     * params:
     * data {Object} 订单详细信息
     */
    _orderFail: function (data) {
        var nameArr = [],
            name = '',
            str = '',
            pArr = data.data.productStatusList;
        for (let i = 0; i < pArr.length; i++) {
            if (!pArr[i].haveStock) {
                name = pArr[i].name;
                if (name.length > 15) {
                    name = name.substr(0, 12) + '...';
                }
                nameArr.push(name);
                if (nameArr.length >= 2) {
                    break;
                }
            }
        }
        str += nameArr.join('、');
        if (nameArr.length > 2) {
            str += ' 等';
        }
        str += ' 缺货';
        wx.showModal({
            title: '下单失败',
            content: str,
            showCancel: false,
            success: function (res) {

            }
        });
    },

    /**
     * 再次支付
     */
    _oneMoresTimePay: function () {
        this._execPay(this.data.id);
    },

    /**
     * 将已经下单的商品从购物车中移除
     */
    deleteProducts: function() {
        let ids = [], arr = this.data.productsArr;
        for (let i = 0; i < arr.length; i++) {
            ids.push(arr[i].id);
        }
        cart.deleteProducts(ids);
    },

    /**
     * 格式化时间
     */
    _dateFormat: function(t) {
        return (t.getFullYear() + '-' + t.getMonth() + 1) + '-'
            + t.getDate() + ' ' + t.toTimeString().substring(0, 8);
    }
})