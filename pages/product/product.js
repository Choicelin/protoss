// pages/product/product.js
import {Product} from './product-model.js'
import {Cart} from '../cart/cart-model.js'

var product = new Product();
var cart = new Cart();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 商品id */
        id: null,
        /** picker 组件的 range 数组 */
        countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        /** 选择的商品数量 */
        productCounts: 1,
        /** 当前选中的 Tab 索引 */
        currentTabsIndex: 0,
        /** 购物车商品总数量 */
        cartTotalCounts: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id;
        this._loadData();
    },

    /**
     * 加载数据
     */
    _loadData: function() {
        var cartTotalCounts = cart.getCartTotalCounts();
        product.getDetailInfo(this.data.id, data => {
            this.setData({
                product: data,
                cartTotalCounts: cartTotalCounts
            });
        });
    },

    /**
     * 改变商品数量
     */
    bindPickerChange: function(event) {
        var index = event.detail.value;
        this.setData({
            productCounts: this.data.countsArray[index]
        });
    },

    /**
     * 点击 Tab, 切换到 Tab 对应的页签
     * 商品详情, 产品参数, 售后保障
     */
    onTabsItemTap: function(event) {
        var index = product.getDataSet(event, 'index');
        this.setData({
            currentTabsIndex: index
        });
    },

    /**
     * 点击加入购物车
     */
    onAddingToCartTap: function(event) {
        //防止快速点击
        if (this.data.isFly) {
            return;
        }
        this._flyToCartEffect(event);

        this.addToCart();
    },

    /**
     * 加入购物车
     */
    addToCart: function() {
        var tempObj = {}, product = this.data.product;
        var keys = ['id', 'name', 'mainImgUrl', 'price'];
        for (var key in product) {
            if (keys.indexOf(key) >= 0) {
                tempObj[key] = product[key];
            }
        }
        cart.add(tempObj, this.data.productCounts);
    },

    /**
     * 点击购物车, 跳转到购物车页面
     */
    onCartTap: function() {
        wx.reLaunch({
            url: '../cart/cart',
        })
    },

    /** 
     * 加入购物车动画
     */
    _flyToCartEffect: function (events) {
        //获得当前点击的位置，距离可视区域左上角
        var touches = events.touches[0];
        var diff = {
            x: '25px',
            y: 25 - touches.clientY + 'px'
        },
            style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
        this.setData({
            isFly: true,
            translateStyle: style
        });
        var that = this;
        setTimeout(() => {
            that.setData({
                isFly: false,
                translateStyle: '-webkit-transform: none;',  //恢复到最初状态
                isShake: true,
            });
            setTimeout(() => {
                var counts = that.data.cartTotalCounts + that.data.productCounts;
                that.setData({
                    isShake: false,
                    cartTotalCounts: counts
                });
            }, 200);
        }, 1000);
    }
})