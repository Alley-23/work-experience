import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BackendAPI from '../../../lib/backend_api';
import { getOrderDetail } from '../../action/order';
import { getCouponList } from '../../action/coupon';
import Loading from '../../component/Loading';

class ChooseCouponPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fetching: true,
            sending: false,
            error: null
        };
    }

    componentDidMount () {
        var props = this.props;

        props.getOrderDetail(props.params.code);
        props.getCouponList({
            orderCode: props.params.code
        });
    }

    componentWillReceiveProps (props) {
        var error = props.couponList.error || props.orderDetail.error;
        if (error) {
            this.setState({
                error: error
            });
            return;
        }

        if (props.couponList.data &&
            props.orderDetail.data &&
            props.couponList.meta.orderCode === props.params.code &&
            props.orderDetail.meta.code === props.params.code
        ) {
            this.setState({
                fetching: false
            });
        }
    }

    submit (coupon) {
        var order = this.props.orderDetail.data;
        var ticketId = coupon ? coupon.ticketCode : null;

        if (ticketId) {
            this.context.router.push({
                pathname: `/order/${order.orderCode}`,
                query: {
                    ticketId
                }
            });

            return;
        }

        if (!order.ticketId) {
            this.context.router.push({
                pathname: `/order/${order.orderCode}`
            });
            return;
        }

        this.setState({
            sending: true
        });

        BackendAPI.updateOrder(order.orderCode, {
            ticketId,
            cityId: order.cityId,
            themeId: order.themeId,
            comboId: order.comboId,
            placeId: order.placeId,
            placeSchedule: order.placeSchedule,
            partyTime: formatDate(order.partyTime),
            kidName: order.kidName,
            kidGender: order.kidGender,
            kidBirthday: formatDate(order.kidBirthday),
            kidRemark: order.kidRemark,
            partyKidsNumber: order.partyKidsNumber,
            partyParentsNumber: order.partyParentsNumber,
            contactPhone: order.contactPhone,
            addCommodities: (order.addCommodities || []).map((item) => ({commodityId: item.commodityId}))
        })
            .then(
                () => {
                    this.context.router.push(`/order/${order.orderCode}`);
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            );
    }

    render () {
        var coupons = this.props.couponList.data;
        var order = this.props.orderDetail.data;
        if (this.state.error) {
            return (<Loading message={this.state.error.message} disableAnimate={ true } />);
        }

        if (this.state.fetching || this.state.sending) {
            return (<Loading />);
        }

        coupons = coupons.filter((coupon) => {
            return coupon.isActive || coupon.ticketCode === order.ticketId;
        });

        if (!coupons.length) {
            return (<Loading message="没有找到优惠券..." disableAnimate={true}/>);
        }

        return (
            <div className="page page-coupon page-choose-coupon">
                <a href="javascript: void(0);"
                    className="btn btn-block btn-large unuse-coupon-btn"
                    onClick={ () => this.submit() }
                >不使用优惠券</a>
                <div className="coupon-list">
                    {
                        coupons.map((coupon, i) => {
                            var className = 'coupon-item';
                            var isSelected = coupon.ticketCode === order.ticketId;
                            if (isSelected) {
                                className += ' active';
                            }

                            return (
                                <div className={ className } key={i}
                                    onClick={
                                        () => {
                                            if (!isSelected) {
                                                this.submit(coupon);
                                            }
                                        }
                                    }
                                >
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
            </div>
        );
    }
}

ChooseCouponPage.contextTypes = {
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
    (dispatch) => bindActionCreators({ getCouponList, getOrderDetail }, dispatch)
)(ChooseCouponPage);