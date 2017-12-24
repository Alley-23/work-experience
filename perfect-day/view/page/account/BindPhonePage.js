import React from 'react';
import { connect } from 'react-redux';
import * as BackendAPI from '../../../lib/backend_api';

import Toast from '../../component/Toast';
import Loading from '../../component/Loading';

const AUTH_TYPE_UPDATE = 3;
const AUTH_TYPE_BIND = 4;

class BindPhonePage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            sending: false,
            countdown: 0,
            phone: null
        };
    }
    countdown (n) {
        var stopAt = Date.now() + n * 1000;

        var timer = setInterval(() => {
            var countdown = parseInt((stopAt - Date.now()) / 1000);
            this.setState({
                countdown: countdown
            });

            if (countdown <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
    sendAuthCode () {
        var phone = this.refs.phone.value;
        if (!/^1[34578]\d{9}$/.test(phone)) {
            this.refs.toast.show('请输入正确的手机号');
            return;
        }
        this.setState({
            sending: true
        });

        BackendAPI.sendAuthCode({
            phone: phone,
            authType: this.props.location.query.mode === 'update' ? AUTH_TYPE_UPDATE : AUTH_TYPE_BIND
        })
            .then(
                () => {
                    this.setState({
                        countdown: 60
                    });
                    this.countdown(60);
                },
                (err) => {
                    if (err.code === -100) {
                        this.setState({
                            countdown: parseInt(err.data/1000)
                        });

                        this.countdown(parseInt(err.data/1000));
                    } else {
                        this.refs.toast.show(err.message || '网络异常，请稍后再试');
                    }
                }
            )
            .then(() => {
                this.setState({
                    sending: false
                });
            });
    }
    bindPhone () {
        var phone = this.refs.phone.value;
        var code = this.refs.code.value;
        var mode = this.props.location.query.mode === 'update' ? AUTH_TYPE_UPDATE : AUTH_TYPE_BIND;

        if (!code) {
            this.refs.toast.show('请输入验证码');
            return;
        }

        if (mode === AUTH_TYPE_UPDATE &&
            !window.confirm('您的手机号将变更为\n' + phone)) {
            return;
        }

        this.setState({
            authing: true,
            phone
        });

        BackendAPI.bindUserPhone({
            phone: phone,
            authCode: code,
            authType: mode
        })
            .then(
                () => {
                    this.refs.toast.show('绑定成功');

                    setTimeout(() => {
                        if (this.props.location.query.callback) {
                            window.location.href = this.props.location.query.callback;
                        } else {
                            this.context.router.push('/account');
                        }
                    }, 1000);
                },
                (err) => {
                    this.setState({
                        authing: false
                    });
                    this.refs.toast.show(err.message || '网络异常，请稍后再试！');
                }
            );
    }
    renderSendBtn () {
        if (this.state.sending) {
            return (
                <button type="button" className="btn btn-round btn-ghost btn-gray">发送中...</button>
            );
        }

        if (this.state.countdown) {
            return (
                <button type="button" className="btn btn-round btn-ghost btn-gray">{this.state.countdown}秒后重发</button>
            );
        }

        return (
            <button
                type="button"
                className="btn btn-round btn-ghost btn-pink"
                onClick={ this.sendAuthCode.bind(this) }
            >获取动态密码</button>
        );
    }
    render () {
        return (
            <div className="page page-register">
                <Toast ref="toast" />
                {
                    (()=>{
                        if (this.state.authing) {
                            return (<Loading />);
                        } else {
                            return (
                                <form ref="form">
                                    <fieldset>
                                        <div className="field">
                                            <label><i>手</i><i>机</i><i>号</i></label>
                                            <input ref="phone" type="tel" name="phone" maxLength={11} defaultValue={ this.state.phone }/>
                                            { this.renderSendBtn() }
                                        </div>
                                        <div className="field">
                                            <label><i>动</i><i>态</i><i>密</i><i>码</i></label>
                                            <input ref="code" type="text" name="code" />
                                        </div>
                                    </fieldset>
                                    <a href="javascript: void(0);"
                                        type="button"
                                        className="btn btn-block btn-large btn-pink"
                                        onClick={ this.bindPhone.bind(this) }
                                    >提交</a>
                                </form>
                            );
                        }
                    })()
                }
            </div>
        );
    }
}

BindPhonePage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state
)(BindPhonePage);