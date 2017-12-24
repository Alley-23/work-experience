import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import { getOrderList } from '../../action/order';
import TabBar from '../../component/TabBar';
import Loading from '../../component/Loading';
import * as Util from '../../util';
import {
    SCHEDULE_TIME,
    ORDER_STATUS_TEXT,
    ALBUM_STATUS_UPLOADED,
    ORDER_STATUS_CANCELED,
    ORDER_STATUS_COMPLETE
} from '../../constant';



class OrderListPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            fetching: true,
            error: null
        };
    }

    componentDidMount () {
        this.props.getOrderList();
    }

    componentWillReceiveProps (props) {
        if (props.orderList.fetching) {
            return;
        } else if (props.orderList.error) {
            if (Util.isNeedLoginError(props.orderList.error)) {
                Util.loginToWeixin();
                return;
            } else {
                this.setState({
                    error: props.orderList.error
                });
            }
        } else {
            this.setState({
                fetching: false
            });
        }
    }

    renderStatus () {
        var orderList = this.props.orderList.data;

        if (this.state.fetching) {
            return <Loading />;
        }

        if (this.state.error) {
            return <Loading message={ this.state.error.message } disableAnimate={true} />;
        }

        if (!orderList.length) {
            return (
                <div className="page page-order-list">
                    <div className="empty-tip">
                        <span className="status-text">您还没有Party订单哦～</span>
                        <Link to={
                            {
                                pathname: '/theme',
                                query: {
                                    cityId: Util.getCityId()
                                }
                            }
                        } className="btn btn-colorful btn-middle">前往开趴</Link>
                        <TabBar />
                    </div>
                </div>
            );
        }
    }

    render () {
        var orderList = this.props.orderList.data;
        if (this.state.fetching || this.state.error || !orderList.length) {
            return this.renderStatus();
        }

        return (
            <div className="page page-order-list">
                {
                    orderList.map((order, i) => {
                        return (
                            <div className="order-item" key={i} >
                                <div className="hd row flex justify">
                                    <i className="sprite-note" />
                                    <h1 className="order-title">{ order.themeName }</h1>
                                    {
                                        (()=>{
                                            if (order.orderStatus === ORDER_STATUS_COMPLETE ||
                                                order.orderStatus === ORDER_STATUS_CANCELED
                                            ) {
                                                return <span className="order-status">{ORDER_STATUS_TEXT[order.orderStatus]}</span>;
                                            } else {
                                                return <span className="order-status"><em>{ORDER_STATUS_TEXT[order.orderStatus]}</em></span>;
                                            }
                                        })()
                                    }
                                </div>
                                <div className="bd">
                                    <Link to={`/order/${order.orderCode}`}>
                                        <div className="field">
                                            <span className="label">订单号</span>
                                            <span className="text">{ order.orderCode }</span>
                                        </div>
                                        <div className="field">
                                            <span className="label"><i>套</i><i>餐</i></span>
                                            <span className="text">完美{ order.comboName }¥{ order.comboPrice }</span>
                                        </div>
                                        <div className="field">
                                            <span className="label"><i>时</i><i>间</i></span>
                                            <span className="text">{formatDate(order.partyTime)}{SCHEDULE_TIME[order.placeSchedule - 1]}</span>
                                        </div>
                                        <div className="field">
                                            <span className="label"><i>地</i><i>址</i></span>
                                            <span className="text">{order.placeAddress}</span>
                                        </div>
                                    </Link>
                                    <i className="sprite-angle-right" />
                                </div>
                                {
                                    (()=> {
                                        if (order.albumStatus === ALBUM_STATUS_UPLOADED) {
                                            return (
                                                <div className="fd">
                                                    <Link to={{pathname: `/account/album/${order.albumId}`, query: {sign: order.albumSign}}}  className="btn btn-ghost btn-pink"
                                                    >浏览相册</Link>
                                                </div>
                                            );
                                        }
                                    })()
                                }
                            </div>
                        );
                    })
                }
                <TabBar />
            </div>
        );
    }
}

function formatDate (date) {
    date = new Date(date);

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getOrderList }, dispatch)
)(OrderListPage);
