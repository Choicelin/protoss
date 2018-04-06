import {Config} from './config.js'

class Token {

    constructor() {
        this.verifyUrl = Config.restUrl + 'token/verify';
        this.tokenUrl = Config.restUrl + 'token/user';
    }

    /**
     * 验证token
     */
    verify(callback) {
        let token = wx.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer(callback);
        } else {
            this._verifyFromServer(token, callback);
        }
    }

    /**
     * 从服务器获取token
     * @params:
     * callBack {function} 回掉函数
     */
    getTokenFromServer(callback) {
        let that = this;
        wx.login({
            success: function(res) {
                wx.request({
                    url: that.tokenUrl,
                    method: 'POST',
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        wx.setStorageSync('token', res.data.token);
                        callback && callback();
                    }
                })
            }
        });
    }

    /**
     * 携带token, 去服务器校验token
     * @params:
     * token {str}
     */
    _verifyFromServer(token, callback) {
        let that = this;
        wx.request({
            url: that.verifyUrl,
            method: 'POST',
            header: {
                token: token
            },
            success: function(res) {
                if (res.statusCode != 200) {
                    // let valid = res.data.data;
                    // if (!valid) {
                    //     that.getTokenFromServer();
                    // }
                    that.getTokenFromServer(callback);
                } else {
                    callback && callback();
                }
            }
        })
    }

}

export {Token}