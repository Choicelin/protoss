// pages/category/category.js
import {Category} from './category-model.js'

var category = new Category();
var categoryInfo = {};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 商品分类列表 */
        categoryTypeArr: null,
        /** 商品分类信息 */
        categoryInfo: null,
        /** 当前菜单索引 */
        currentMenuIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadData();
        this.setData({
            categoryInfo: categoryInfo
        });
    },

    /**
     * 加载页面数据
     */
    _loadData: function() {
        this._changeData(0);
    },

    /**
     * 改变页面数据, 加载索引为 index 的商品分类信息
     * @params:
     * index {int} 商品分类数组索引
     */
    _changeData: function(index) {
        category.getCategoryType(categoryData => {

            categoryInfo.title = categoryData[index].name;
            categoryInfo.topImgUrl = categoryData[index].topicImage.url;

            var id = categoryData[index].id;
            category.getProductsByCategory(id, data => {

                categoryInfo.products = data;
                
                this.setData({
                    currentMenuIndex: index,
                    categoryTypeArr: categoryData,
                    categoryInfo: categoryInfo
                });
            });
        });
    },

    /**
     * 点击商品分类, 选中点击的商品分类, 并改变商品列表
     */
    changeCategory: function(event) {
        var index = category.getDataSet(event, 'index');
        this._changeData(index);
    },

    /**
     * 点击商品, 跳转到商品详情页
     */
    onProductsItemTap: function(event) {
        var id = category.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
})