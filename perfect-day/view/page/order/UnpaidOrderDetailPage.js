import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

import * as BackendAPI from '../../../lib/backend_api';
import dateFormatter from '../../../lib/date_formatter';
import { getCouponList } from '../../action/coupon';
import { getOrderDetail } from '../../action/order';
import { SCHEDULE_TIME } from '../../constant';
import ResponsiveImage from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import Toast from '../../component/Toast';

class UnpaidOrderDetailPage extends React.Component {
    constructor (props) {
        var couponListFetched = false;
        var orderDetailFetched = false;
        var themeDetailFetched = false;

        var couponList = props.couponList;
        var orderDetail = props.orderDetail;
        var themeDetail = props.themeDetail;
        var code = props.code;

        var ticketId = props.location.query.ticketId;

        super(props);

        if (couponList.data &&
            couponList.meta.orderCode === code
        ) {
            couponListFetched = true;
        }

        if (orderDetail.data &&
            orderDetail.meta.code === code &&
            orderDetail.meta.ticketId === ticketId
        ) {
            orderDetailFetched = true;

            if (themeDetail.data && themeDetail.data.id === orderDetail.data.themeId) {
                themeDetailFetched = true;
            }
        }

        this.state = {
            fetching: !couponListFetched || !orderDetailFetched || !themeDetailFetched,
            submitting: false,
            error: null
        };
    }

    componentDidMount () {
        var couponListFetched = false;
        var orderDetailFetched = false;
        var themeDetailFetched = false;
        var couponList = this.props.couponList;
        var orderDetail = this.props.orderDetail;
        var themeDetail = this.props.themeDetail;
        var code = this.props.code;
        var ticketId = this.props.location.query.ticketId;

        if (
            !couponList.data ||
            !couponList.meta ||
            couponList.meta.orderCode !== code
        ) {
            this.props.getCouponList({
                orderCode: code
            });
        } else {
            couponListFetched = true;
        }

        if (
            !orderDetail.data ||
            !orderDetail.meta ||
            orderDetail.meta.code !== code ||
            orderDetail.meta.ticketId !== ticketId
        ) {
            this.props.getOrderDetail(code, {
                ticketId: ticketId
            });
        } else {
            orderDetailFetched = true;
            if (themeDetail.data &&
                themeDetail.data.id === orderDetail.data.themeId
            ) {
                themeDetailFetched = true;
            } else {
                this.props.getThemeDetail({
                    themeId: orderDetail.data.themeId,
                    cityId: orderDetail.data.cityId
                });
            }
        }

        this.setState({
            fetching: !couponListFetched || !orderDetailFetched || !themeDetailFetched
        });
    }

    componentWillReceiveProps (props) {
        var error = props.couponList.error ||
                    props.orderDetail.error ||
                    props.themeDetail.error;

        if (error) {
            this.setState({
                error: error
            });

            return;
        }

        if (
            props.couponList.data &&
            props.orderDetail.data &&
            props.couponList.meta.orderCode === props.code &&
            props.orderDetail.meta.code === props.code
        ) {
            if (props.themeDetail.data &&
                props.themeDetail.data.id === props.orderDetail.data.themeId
            ) {
                this.setState({
                    fetching: false
                });
            } else if (!props.themeDetail.fetching) {
                props.getThemeDetail({
                    themeId: props.orderDetail.data.themeId,
                    cityId: props.orderDetail.data.cityId
                });
            }
        }
    }

    goPaymentPage () {
        var order = this.props.orderDetail.data;
        var ticketId = this.props.location.query.ticketId;
        this.setState({
            submitting: true
        });

        function jump () {
            var payRecord = _.find(order.orderPays, function (row) {
                return row.payStatus === 100;
            });

            if (!payRecord) {
                window.alert('系统异常：找不到可支付的订单ID！');
                return;
            }

            window.location.href = `/payment?orderCode=${order.orderCode}&payId=${payRecord.id}`;
        }
        if (!ticketId) {
            jump();
            return;
        }
        BackendAPI.updateOrder(order.orderCode, {
            ticketId,
            cityId: order.cityId,
            themeId: order.themeId,
            comboId: order.comboId,
            placeId: order.placeId,
            placeSchedule: order.placeSchedule,
            partyTime: dateFormatter(order.partyTime, 'yyyy-mm-dd'),
            kidName: order.kidName,
            kidGender: order.kidGender,
            kidBirthday: dateFormatter(order.kidBirthday, 'yyyy-mm-dd'),
            kidRemark: order.kidRemark,
            partyKidsNumber: order.partyKidsNumber,
            partyParentsNumber: order.partyParentsNumber,
            contactPhone: order.contactPhone,
            addCommodities: (order.addCommodities || []).map((item) => ({commodityId: item.commodityId}))
        })
            .then(
                () => {
                    jump();
                },
                (error) => {
                    this.refs.toast.show(error.message);
                    this.setState({
                        submitting: false
                    });
                }
            );
    }

    render () {
        var order = this.props.orderDetail.data;
        var theme = this.props.themeDetail.data;
        var couponList = this.props.couponList.data;
        if (this.state.fetching) {
            return (<Loading />);
        }
        if (this.state.error) {
            return (<Loading message={ this.state.error.message } disableAnimate={true} />);
        }

        couponList = couponList.filter((item) => item.isActive);
        var extraAdult = order.partyParentsNumber - order.comboParents;
        var extraChild = order.partyKidsNumber - order.comboKids;
        try {
            return (
                <div className="page page-unpaid-order-detail">
                    <Toast ref="toast" />
                    <div className="head row flex middle justify">
                        <i className="sprite-clock-large" />
                        <p>请您尽快支付,<br />以免场地被抢占哟～</p>
                        <div className="col-3">
                            <a href={`/checkout?orderCode=${ order.orderCode }`} className="btn btn-block btn-pink">
                                修改订单
                            </a>
                        </div>
                    </div>
                    <section className="section">
                        <div className="field field-code">
                            <span className="label">订单编号</span>
                            <span>{ order.orderCode }</span>
                        </div>
                        <div className="theme-info row flex">
                            <div className="theme-image">
                                <ResponsiveImage src={ theme.detailImgUrl } ratio={ 1 } cut={ true }/>
                            </div>
                            <div className="col-flex">
                                <h1 className="theme-name">{ theme.title }</h1>
                                <p className="theme-desc">完美{ order.comboName }套餐，含{ order.comboKids }个家庭，小寿星家庭2大1小，其余1大1小</p>
                            </div>
                        </div>
                    </section>
                    <section className="section">
                        <h2 className="section-title">派对信息</h2>
                        <div className="field">
                            <span className="label">派对时间</span>
                            <span className="field-text">
                                { formatDate(order.partyTime) }
                                { SCHEDULE_TIME[order.placeSchedule-1] }
                            </span>
                        </div>
                        <div className="field">
                            <span className="label">派对门店</span>
                            <span className="field-text">{ order.placeName }</span>
                        </div>
                        <div className="field">
                            <span className="label">派对人数</span>
                            <span className="field-text">大人{order.partyParentsNumber}人，孩子{order.partyKidsNumber}人</span>
                        </div>
                        <div className="field">
                            <span className="label">增值服务</span>
                            <span className="field-text">
                                { (order.addCommodities || []).map((item) => item.commodityName).join('、') }
                            </span>
                        </div>
                    </section>
                    <section className="section">
                        <h2 className="section-title">主人公信息</h2>
                        <div className="field">
                            <span className="label">小寿星</span>
                            <span className="field-text">{ order.kidName }</span>
                            <span className="field-text">{ ({1: '男', 2: '女'})[order.kidGender] }</span>
                        </div>
                        <div className="field">
                            <span className="label"><i>生</i><i>日</i></span>
                            <span className="field-text">{ formatDate(order.kidBirthday) }</span>
                        </div>
                        <div className="field">
                            <span className="label"><i>备</i><i>注</i></span>
                            <span className="field-text">{ order.kidRemark || '无' }</span>
                        </div>
                    </section>
                    <section className="section">
                        <h2 className="section-title">订单信息</h2>
                        <div className="field row flex justify">
                            <span className="field-text">套餐价格</span>
                            <span className="field-text">¥{ order.comboPrice }</span>
                        </div>
                        {
                            (order.addCommodities || []).map((commodity, i) => {
                                return (
                                    <div className="field row flex justify" key={i}>
                                        <span className="field-text">{ commodity.commodityName }</span>
                                        <span className="field-text">¥{ commodity.commodityPrice }</span>
                                    </div>
                                );
                            })
                        }
                        {
                            (() => {
                                if (order.addPersonPrice) {
                                    return (
                                        <div className="field row flex justify">
                                            <span className="field-text">套餐外人数(
                                                { extraAdult ? extraAdult + '大人'+(extraChild?', ':'') : ''}
                                                { extraChild ? extraChild + '小孩' : ''})
                                            </span>
                                            <span className="field-text">¥{order.addPersonPrice}</span>
                                        </div>
                                    );
                                }
                            })()
                        }
                    </section>
                    <section className="section">
                        <div className="field"
                            onClick={
                                () => this.context.router.push('/order/' + order.orderCode + '/coupon')
                            }
                        >
                            <span className="label">优惠券</span>
                            {
                                (() => {
                                    if (order.ticketFee) {
                                        return [
                                            <span key={1} className="field-text coupon-amount"><em>-{ order.ticketFee }元</em></span>
                                        ];
                                    } else if (couponList.length) {
                                        return <span className="field-text"><em>{ couponList.length }张可用</em></span>;
                                    } else {
                                        return <span className="field-text">{ couponList.length }张可用</span>;
                                    }
                                })()
                            }
                            <i className="sprite-angle-right" />
                        </div>
                    </section>
                    <div className="footer">
                        <div className="footer-wrapper row flex middle">
                            <div className="col-flex">
                                <p className="total">合计：<span className="price">¥<em>{ order.salePrice }</em></span></p>
                                {
                                    (() => {
                                        if (order.ticketFee) {
                                            return <sub>优惠券已抵用{ order.ticketFee }元</sub>;
                                        }
                                    })()
                                }
                            </div>
                            <div className="col-3">
                                <a href="javascript: void(0);"
                                    onClick={ this.goPaymentPage.bind(this) }
                                    className={`btn btn-block ${ this.state.submitting ? "btn-gray" : "btn-pink"}`}
                                >立即支付</a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (ex) {
            console.log(ex);
        }
    }
}

UnpaidOrderDetailPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function formatDate (time) {
    time = new Date(time);

    return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getCouponList, getOrderDetail }, dispatch)
)(UnpaidOrderDetailPage);