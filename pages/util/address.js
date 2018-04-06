import {Base} from './base.js'
import {Config} from './config.js'

class Address extends Base {

    /**
     * 获取收获地址
     */
    getAddress(callback) {
        let that = this;
        let param = {
            url: 'address',
            sCallback: function (res) {
                if (res) {
                    res.totalDetail = that.setAddressInfo(res);
                    callback && callback(res);
                }
            }
        };
        this.request(param);
    }

    /**
     * 设置地址信息
     * @params:
     * res {Object} 地址信息
     */
    setAddressInfo(res) {
        let province = res.provinceName || res.province,
            city = res.cityName || res.city,
            country = res.countyName || res.country,
            detail = res.detailInfo || res.detail;

        let totalDetail = city + country + detail;

        if (!this.isCenterCity(city)) {
            totalDetail = province + totalDetail;
        }
        
        return totalDetail;
    }

    /**
     * 是否为直辖市
     */
    isCenterCity(name) {
        let centerCity = ['北京市', '天津市', '上海市', '重庆市'];
        return centerCity.indexOf(name) >= 0;
    }

    /**
     * 保存地址
     */
    _setUpAddress(res, callback) {
        let formData = {
            name: res.userName,
            province: res.provinceName,
            city: res.cityName,
            country: res.countyName,
            mobile: res.telNumber,
            detail: res.detailInfo
        };
        return formData;
    }

    /**
     * 更新保存地址
     */
    submitAddress(data, callback) {
        data = this._setUpAddress(data);
        var param = {
            url: 'address',
            type: 'post',
            data: data,
            sCallback: function (res) {
                callback && callback(res, false);
            }
        };
        this.request(param);
    }

}

export {Address}