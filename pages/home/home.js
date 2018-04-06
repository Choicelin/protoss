import {Home} from 'home-model.js'

var home = new Home();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        this._loadData();
    },

    /**
     * 加载数据
     */
    _loadData: function() {
        var id = 1;
        home.getBannerData(id, res => {
            this.setData({
                bannerArr: res
            });
        });

        home.getThemeData(res => {
            this.setData({
                themeArr: res
            });
        });

        home.getProductsData(data => {
            this.setData({
                productArr: data
            });
        });
    },

    /**
     * 点击商品信息, 跳转商品详情页
     */
    onProductsItemTap: function(event) {
        var id = home.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id
        })
    },

    /**
     * 点击主题信息, 跳转主题详情页
     */
    onThemesItemTap: function(event) {
        var id = home.getDataSet(event, 'id');
        var name = home.getDataSet(event, 'name');
        wx.navigateTo({
            url: '../theme/theme?id=' + id + '&name=' + name
        })
    }
})