import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BackendAPI from '../../../lib/backend_api';
import Loading from '../../component/Loading';
import Toast from '../../component/Toast';
import { weixinUserSessionErrorHandler, isWeixin } from '../../util';

class PaymentPage extends React.Component {
    constructor (props) {
        var code = props.location.query.orderCode;
        super(props);


        this.state = {
            error: null,
            code
        };
    }

    componentDidMount () {
        var query = this.props.location.query;
        if (isWeixin()) {
            BackendAPI.getOrderPaymentParams({
                orderCode: query.orderCode,
                payId: query.payId
            })
                .catch(weixinUserSessionErrorHandler)
                .then(
                    (params) => {
                        if (params.isPaySuccess) {
                            this.goSuccessPage();
                            return;
                        }

                        this.invokeWeixinPay(params);
                    },
                    (err) => {
                        window.alert(err.message || '支付参数获取失败，请稍后再试');
                        window.history.go(-1);
                    }
                );
        } else {
            window.alert('请在微信中支付');
            window.history.go(-1);
        }
    }

    goSuccessPage () {
        window.location.href = `/payment/${this.state.code}`;
    }

    goOrderDetailPage () {
        window.location.href = `/order/${this.state.code}`;
    }

    invokeWeixinPay (params) {
        var toast = this.refs.toast;
        var self = this;

        function onBridgeReady () {
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', params, function(res){
                if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                    toast.show('用户取消支付');
                    setTimeout(() => {
                        window.history.go(-1);
                    }, 1000);
                } else if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    toast.show('支付成功');
                    self.goSuccessPage();
                } else {
                    window.alert('支付异常: ' + res.err_msg);
                    self.goOrderDetailPage();
                }
            });
        }
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
    }

    render () {
        return (
            <div>
                <Toast ref="toast" />
                {(() => {
                    if (this.state.error) {
                        return <Loading message={ this.state.error.message } />;
                    } else {
                        return <Loading message="支付中..." />;
                    }
                })()}
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ }, dispatch)
)(PaymentPage);
