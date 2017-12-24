import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { SERVICE_PHONE } from '../../constant';
import { getCurrentUser } from '../../action/user';
import TabBar from '../../component/tabbar';
import Loading from '../../component/Loading';
import * as Util from '../../util';

class AccountIndexPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentWillMount () {
        this.props.getCurrentUser();
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.user.error && Util.isNeedLoginError(nextProps.user.error)) {
            Util.loginToWeixin();
        }
    }
    shouldComponentUpdate (nextProps) {
        return !nextProps.user.error;
    }
    renderPhoneRow () {
        var phone = this.props.user.data.phone;

        if (phone) {
            return (
                <Link className="section-row" to="/account/bind_phone?mode=update">
                    <i className="sprite-crown" />
                    <span className="section-row-text">绑定手机号</span>
                    <span className="section-row-text">{ phone.replace(/^(\d{3}).*(\d{4})$/, '$1****$2') }</span>
                    <span className="section-row-sub-text">修改</span>
                    <i className="fi fi-angle-right" />
                </Link>
            );
        } else {
            return (
                <Link className="section-row" to="/account/bind_phone">
                    <i className="sprite-crown" />
                    <span className="section-row-text">绑定手机号</span>
                    <i className="fi fi-angle-right" />
                </Link>
            );
        }
    }
    render () {
        var user = this.props.user;
        if (user.fetching || !user.data) {
            return (<Loading />);
        }

        let qrcodeLink;
        if (user.data.hasQrcode) {
            qrcodeLink = <Link className="section-row" to="/account/qrcode"><i className="sprite-crown" /><span className="section-row-text">我的二维码</span><i className="fi fi-angle-right" /></Link>;
        }

        return (
            <div className="page page-account-index">
                <div className="head">
                    <img className="avatar" src={ user.data.logo } />
                    <span className="nickname">{ user.data.nickName }</span>
                </div>
                <section className="section">
                    <Link className="section-row" to="/account/coupon">
                        <i className="sprite-crown" />
                        <span className="section-row-text">我的优惠券</span>
                        <i className="fi fi-angle-right" />
                    </Link>
                    <Link className="section-row" to="/order">
                        <i className="sprite-crown" />
                        <span className="section-row-text">我的订单</span>
                        <i className="fi fi-angle-right" />
                    </Link>
                    {qrcodeLink}
                    <Link className="section-row" to="/account/invitation">
                        <i className="sprite-crown" />
                        <span className="section-row-text">我的邀请函</span>
                        <i className="fi fi-angle-right" />
                    </Link>
                    { this.renderPhoneRow() }
                    <Link className="section-row" to="/account/album">
                        <i className="sprite-crown" />
                        <span className="section-row-text">我的相册</span>
                        <i className="fi fi-angle-right" />
                    </Link>
                </section>
                <section className="section">
                    <a className="section-row" href={`tel:${ SERVICE_PHONE }`}>
                        <i className="sprite-crown" />
                        <span className="section-row-text">客服电话</span>
                        <span className="section-row-text">{ SERVICE_PHONE.replace(/^(\d{3})(\d{4})(\d*)$/, '$1-$2-$3')  }</span>
                        <span className="section-row-sub-text">9:00 ~ 18:00</span>
                    </a>
                </section>
                <TabBar />
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getCurrentUser }, dispatch)
)(AccountIndexPage);
