// pages/cart/cart.js
import {Cart} from './cart-model.js'
import {Token} from '../util/token.js'

let cart = new Cart();
let token = new Token();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 购物车中的商品数据 */
        cartData: null,
        /** 已选择商品的总数量 */
        selectedCounts: 0,
        /** 已选择商品类型的总数量 */
        selectedTypeCounts: 0,
        /** 已选择商品的总金额 */
        account: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this._loadData();
    },

    /**
     * 加载数据
     */
    _loadData: function() {
        let cartData = cart.getCartDataFromLocal();
        let tempObj = this._calcTotalAccountAndCounts(cartData);
        this.setData({
            cartData: cartData,
            selectedCounts: tempObj.selectedCounts,
            selectedTypeCounts: tempObj.selectedTypeCounts,
            account: tempObj.account
        });
    },

    /**
     * 改变商品的数量
     * 点击 '+': 商品数量加 1
     * 点击 '-': 商品数量减 1
     */
    changeCounts: function(event) {
        let id = cart.getDataSet(event, 'id');
        let cType = cart.getDataSet(event, 'type');
        if (cType === 'cut') {
            cart.cutCounts(id);
        } else {
            cart.addCounts(id);
        }
        this._loadData();
    },

    /**
     * 点击删除按钮, 把商品从购物车移除
     */
    delete: function(event) {
        let id = cart.getDataSet(event, 'id');
        cart.deleteOne(id);
        this._loadData();
    },

    /**
     * 点击单个商品选择按钮, 切换商品的选择状态
     */
    toggleSelect: function(event) {
        let id = cart.getDataSet(event, 'id');
        let selected = cart.getDataSet(event, 'status');
        cart.setOneSelectStatus(id, !selected);
        this._loadData();
    },

    /**
     * 点击全选按钮, 切换商品的选择状态
     */
    toggleSelectAll: function(event) {
        let selected = cart.getDataSet(event, 'status');
        cart.setAllSelectStatus(!selected);
        this._loadData();
    },

    /**
     * 点击商品事件, 跳转商品详情页
     */
    onProductsItemTap: function(event) {
        let id = cart.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id,
        })
    },

    /**
     * 计算已选择商品总金额和总数量
     * @params:
     * data {Array} 购物车中的所有商品
     * @return {Object} 属性:
     * selectedCounts, selectedTypeCounts, account
     */
    _calcTotalAccountAndCounts: function(data) {
        let len = data.length;
        let account = 0;
        let selectedCounts = 0;
        let selectedTypeCounts = 0;
        let multiple = 100;

        for (let i = 0; i < len; i++) {
            if (data[i].selectStatus) {
                account += data[i].counts * multiple * data[i].price * multiple;
                selectedCounts += data[i].counts;
                selectedTypeCounts ++;
            }
        }

        return {
            selectedCounts: selectedCounts,
            selectedTypeCounts: selectedTypeCounts,
            account: account / (multiple * multiple)
        }
    },

    /**
     * 下单
     */
    submitOrder: function(event) {
        wx.navigateTo({
            url: '../order/order?account=' + this.data.account + '&from=cart',
        });
    }
})