// pages/theme/theme.js
import {Theme} from './theme-model.js'

var theme = new Theme();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var name = options.name;
        this.data.id = id;
        this.data.name = name;
        this._loadData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        wx.setNavigationBarTitle({
            title: this.data.name,
        })
    },

    /**
     * 加载数据
     */
    _loadData: function() {
        theme.getProductsData(this.data.id, data => {
            this.setData({
                themeInfo: data
            });
        });
    },

    /**
     * 点击商品信息, 跳转到商品详情页
     */
    onProductsItemTap: function (event) {
        var id = theme.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id,
        })
    }
})