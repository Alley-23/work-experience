import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../../component/Loading';
import { getCouponList } from '../../action/coupon';
import { getCurrentUser } from '../../action/user';
import * as Util from '../../util';

class CouponListPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fetching: true,
            error: null,
            isActive: true
        };
    }

    componentDidMount () {
        if (!this.props.user.data) {
            this.props.getCurrentUser();
        }
        this.props.getCouponList();
    }

    componentWillReceiveProps (props) {
        var error = props.couponList.error || this.props.user.error;

        if (this.props.user.data && !this.props.user.data.phone) {
            this.context.router.replace({
                pathname: '/account/bind_phone',
                query: {
                    callback: window.location.href
                }
            });
            return;
        }

        if (error) {
            if (Util.isNeedLoginError(error)) {
                Util.loginToWeixin();
            }
            this.setState({
                error
            });
        } else if (props.couponList.data && props.couponList.meta == null) {
            this.setState({
                fetching: false
            });
        }
    }

    render () {
        var coupons = this.props.couponList.data;
        if (this.state.error) {
            return <Loading message={ this.state.error.message } disableAnimate={ true }/>;
        }

        if (this.state.fetching) {
            return <Loading />;
        }

        coupons = coupons.filter((coupon) => coupon.isActive === this.state.isActive );

        return (
            <div className="page page-coupon-list page-coupon">
                <div className="head row">
                    <div className="col-6" onClick={
                        () => this.setState({
                            isActive: true
                        })
                    }>
                        <span className={`tab-item ${ this.state.isActive ? 'active' : ''}`}>可使用</span>
                    </div>
                    <div className="col-6" onClick={
                        () => this.setState({
                            isActive: false
                        })
                    }>
                        <span className={`tab-item ${ this.state.isActive ? '' : 'active'}`}>不可用</span>
                    </div>
                </div>
                {
                    coupons.map((coupon, i) => {
                        var className = 'coupon-item';
                        if (!this.state.isActive) {
                            className += ' expired';
                        }
                        return (
                            <div className={ className } key={i} >
                                <div className="hd row flex middle">
                                    <div className="col-4">
                                    { (() => {
                                        if (coupon.couponType === 0) {
                                            return (
                                                <span className="price">
                                                    ¥<em>{ coupon.discount / 100 }</em>
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="price">
                                                    <em>{ coupon.discount / 10 }</em>折
                                                </span>
                                            );
                                        }
                                    })() }
                                    </div>
                                    <div className="col-flex">
                                        <h2 className="coupon-name">
                                            { coupon.title }
                                        </h2>
                                    </div>
                                </div>
                                <div className="fd">
                                    <p className="text">{ coupon.useStore }</p>
                                    <p className="text">有效期：{formatDate(coupon.startTime)}～{formatDate(coupon.expireTime)}</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

CouponListPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function formatDate (time) {
    time = new Date(time);

    return [
        time.getFullYear(),
        time.getMonth() + 1,
        time.getDate()
    ].join('-');
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getCouponList, getCurrentUser }, dispatch)
)(CouponListPage);
