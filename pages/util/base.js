import {Config} from './config.js'
import {Token} from './token.js'

class Base {

    constructor() {
        this.baseRequestUrl = Config.restUrl;
    }

    /**
     * 发送 http 请求, 所有继承 Base 的子类都可以使用此方法发送 http 请求
     * @params:
     * params {Object} http 请求信息, 包括 url, data, type, sCallback
     * noRefetch {bool} 当 noRefetch 为 true 时, 不做未授权重试机制
     */
    request(params, noRefetch) {
        let that = this;
        let url = this.baseRequestUrl + params.url;

        if (!params.type) {
            params.type = 'GET';
        }

        wx.request({
            url: url,
            data: params.data,
            method: params.type,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },
            success: function(res) {
                let code = res.statusCode.toString();
                let startChar = code.charAt(0);

                if (startChar == '2') {
                    params.sCallback && params.sCallback(res.data);
                } else {
                    if (code == '401' && !noRefetch) {
                        that._refetch(params);
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    }

    _refetch(params) {
        let token = new token();
        token.getTokenFromServer((token) => {
            this.request(params, true);
        });
    }

    /**
     * 获取点击事件的dataset
     * @params:
     * event {Object} 点击事件
     * key {str}
     */
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    }
}

export {Base}