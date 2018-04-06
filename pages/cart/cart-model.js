import {Base} from '../util/base.js'

class Cart extends Base {

    constructor() {
        super();
        this._storageKeyName = 'cart';
    }

    /**
     * 向购物车中添加商品
     * @params:
     * item {Object} 商品对象
     * counts {int} 商品数量
     */
    add(item, counts) {
        var cartData = this.getCartDataFromLocal();
        var index = this._getIndex(item, cartData);
        if (index == -1) {
            item.counts = counts;
            item.selectStatus = true;
            cartData.push(item);
        } else {
            cartData[index].counts += counts;
        }
        this._setCartStorage(cartData);
    }

    /**
     * 从缓存中读取购物车数据
     * @return {Array} 购物车
     */
    getCartDataFromLocal() {
        var res = wx.getStorageSync(this._storageKeyName);
        return res || [];
    }

    /**
     * 获取购物车中商品总数量
     * @param:
     *  flag {boolean} 考虑商品选择状态
     * @return {int}
     */
    getCartTotalCounts(flag) {
        var cartData = wx.getStorageSync(this._storageKeyName);
        var cartTotalCounts = 0;
        for (var i in cartData) {
            if (flag) {
                if (cartData[i].selectStatus) {
                    cartTotalCounts += cartData[i].counts;
                }
            } else {
                cartTotalCounts += cartData[i].counts;
            }
        }
        return cartTotalCounts;
    }

    /**
     * 为购物车所有商品设置selectStatus属性
     * @param selectStatus {boolean}
     */
    setAllSelectStatus(selectStatus) {
        let cartData = this.getCartDataFromLocal();
        for (let i = 0; i < cartData.length; i++) {
            cartData[i].selectStatus = selectStatus;
        }
        this._setCartStorage(cartData);
    }

    /**
     * 为单个商品设置selectStatus属性
     * @param id {int} 商品id
     * @param selectStatus {boolean}
     */
    setOneSelectStatus(id, selectStatus) {
        let cartData = this.getCartDataFromLocal();
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i].id === id) {
                cartData[i].selectStatus = selectStatus;
            }
        }
        this._setCartStorage(cartData);
    }

    /**
     * 单个商品数量加 1
     * @param id {int} 商品id
     */
    addCounts(id) {
        let cartData = this.getCartDataFromLocal();
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i].id === id) {
                cartData[i].counts ++;
            }
        }
        this._setCartStorage(cartData);
    }

    /**
     * 单个商品数量减 1
     * @param id {int} 商品id
     */
    cutCounts(id) {
        let cartData = this.getCartDataFromLocal();
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i].id === id) {
                cartData[i].counts--;
            }
        }
        this._setCartStorage(cartData);
    }

    /**
     * 在购物车中删除商品
     * @params:
     *  id {int} 商品id
     */
    deleteOne(id) {
        let cartData = this.getCartDataFromLocal();
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i].id === id) {
                cartData.splice(i, 1);
            }
        }
        this._setCartStorage(cartData);
    }

    /**
     * 在购物车中删除多个商品
     * @params:
     *  ids {Array} 商品id数组
     */
    deleteProducts(ids) {
        for (let i = 0; i < ids.length; i++) {
            this.deleteOne(ids[i]);
        }
    }

    /**
     * 获取某个商品在购物车数组中的索引,
     * 如果该商品不在购物车中, 返回 -1
     * @params:
     * item {Object} 该商品的 id
     * arr {Array} 购物车
     */
    _getIndex(item, arr) {
        var index = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == item.id) {
                index = i;
            }
        }
        return index;
    }

    /**
     * 设置内存中购物车的数据
     */
    _setCartStorage(cartData) {
        wx.setStorageSync(this._storageKeyName, cartData);
    }
}

export {Cart}