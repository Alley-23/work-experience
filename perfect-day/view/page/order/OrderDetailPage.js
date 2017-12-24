import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SERVICE_PHONE } from '../../constant';
import dateFormatter from '../../../lib/date_formatter';
import * as BackendAPI from '../../../lib/backend_api';
import { getOrderDetail } from '../../action/order';
import { getThemeDetail } from '../../action/theme';
import { getInvitationDetail } from '../../action/invitation';
import Loading from '../../component/Loading';
import ResponsiveImage from '../../component/ResponsiveImage';
import UnpaidOrderDetailPage from './UnpaidOrderDetailPage';
import _ from 'underscore';

import {
    ORDER_STATUS_UNPAID,
    ORDER_STATUS_WAITING_FOR_CONFIRM,
    ORDER_STATUS_PREPARING,
    ORDER_STATUS_PREPARED,
    ORDER_STATUS_COMPLETE,
    ORDER_STATUS_WAITING_FOR_UPDATE,
    ORDER_STATUS_CONFIRMED,
    ALBUM_STATUS_UPLOADED
} from '../../constant';

class OrderDetailPage extends React.Component {
    constructor (props) {
        var code = props.params.code;
        super(props);
        this.state = {
            error: null,
            fetching: true,
            code
        };
    }

    componentDidMount () {
        this.props.getOrderDetail(this.props.params.code);
    }

    componentWillReceiveProps(props) {
        var error = props.orderDetail.error || props.themeDetail.error;
        if (error) {
            if (props.orderDetail.error && props.orderDetail.error.code === -440001) {
                setTimeout(() => {
                    this.context.router.push('/index');
                }, 1000);
            }
            this.setState({
                error
            });
            return error;
        }

        if (props.orderDetail.data &&
            props.orderDetail.meta.code == this.state.code
        ) {
            if (props.themeDetail.fetching) {
                return;
            }

            if ((props.themeDetail.data &&
                props.themeDetail.data.id === props.orderDetail.data.themeId)
              ) {
                if (props.orderDetail.data.invitationId ===0 ||
                    (props.invitationDetail.data && props.invitationDetail.data.id === props.orderDetail.data.invitationId)
                   ) {
                      this.setState({
                          fetching: false
                      });
                }
            } else {
                this.props.getThemeDetail({
                    cityId: props.orderDetail.data.cityId,
                    themeId: props.orderDetail.data.themeId
                });
            }
        }
        if (props.orderDetail.data &&
            props.orderDetail.data.invitationId !==0 &&
            props.orderDetail.data.invitationSign) {
            if (props.invitationDetail.fetching) {
                return;
              }

            if (props.invitationDetail.data &&
                props.invitationDetail.data.id === props.orderDetail.data.invitationId
            ) {
                if (props.orderDetail.meta.code !== this.state.code ||
                    (props.themeDetail.data && props.themeDetail.data.id === props.orderDetail.data.themeId)
                  ) {
                    this.setState({
                        fetching: false
                    });
                }
            } else {
                this.props.getInvitationDetail({
                    id: props.orderDetail.data.invitationId,
                    sign: props.orderDetail.data.invitationSign
                });
            }
        }
    }

    renderCompleteStatus () {
        var order = this.props.orderDetail.data;

        if (
            order.orderStatus !== ORDER_STATUS_COMPLETE ||
            order.albumStatus !== ALBUM_STATUS_UPLOADED
        ) {
            return null;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    <i className="sprite-check-on" />
                    派对完成
                </h2>
                <div className="content">
                    <p className="content-text">本次服务已完成，感谢您的信任，喜欢我就把我推荐给您的朋友吧～</p>
                </div>
            </div>
        );
    }

    renderAlbumStatus () {
        var order = this.props.orderDetail.data;

        if (
            order.orderStatus !== ORDER_STATUS_COMPLETE ||
            order.albumStatus !== ALBUM_STATUS_UPLOADED
        ) {
            return null;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    <i className="sprite-camera" />
                    照片已上传
                </h2>
                <div className="content">
                    <p className="content-text">管家已将派对精彩时刻上传 </p>
                </div>
            </div>
        );
    }

    renderPartyStatus () {
        var order = this.props.orderDetail.data;
        var sprite = <i className="sprite-check-on" />;

        if (order.orderStatus !== ORDER_STATUS_COMPLETE) {
            return null;
        }

        if (order.albumStatus === ALBUM_STATUS_UPLOADED) {
            sprite = <i className="sprite-check-on-gray" />;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    { sprite }
                    举办完成
                </h2>
                <div className="content">
                    <p className="content-text">派对现场活动结束啦～管家将为您传送精彩照片</p>
                </div>
            </div>
        );
    }

    renderPreparedStatus () {
        var orderStatus = this.props.orderDetail.data.orderStatus;
        if (
            [
                ORDER_STATUS_PREPARED,
                ORDER_STATUS_COMPLETE
            ].indexOf(orderStatus) === -1
        ) {
            return null;
        }
        var sprite = <i className="sprite-prepare" />;

        if (orderStatus === ORDER_STATUS_PREPARED) {
            sprite = <i className="sprite-prepare-active" />;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    { sprite }
                    筹备完成
                </h2>
                <div className="content">
                    <p className="content-text">一切准备就绪，完美派对即将开始</p>
                </div>
            </div>
        );
    }

    renderPreparingStatus () {
        var orderStatus = this.props.orderDetail.data.orderStatus;
        var sprite = <i className="sprite-prepare" />;
        if (
            [
                ORDER_STATUS_PREPARING,
                ORDER_STATUS_PREPARED,
                ORDER_STATUS_COMPLETE
            ].indexOf(orderStatus) === -1
        ) {
            return null;
        }

        if (orderStatus === ORDER_STATUS_PREPARING) {
            sprite = <i className="sprite-prepare-active" />;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    { sprite }
                    筹备中
                </h2>
                <div className="content">
                    <p className="content-text">蛋糕、甜品、场地布置、演职人员等其他物料紧锣密鼓筹备中</p>
                </div>
            </div>
        );
    }
    renderConfirmedStatus () {
        var orderStatus = this.props.orderDetail.data.orderStatus;
        var sprite = <i className="sprite-prepare" />;
        if (orderStatus === ORDER_STATUS_WAITING_FOR_CONFIRM || orderStatus === ORDER_STATUS_WAITING_FOR_UPDATE) {
            return null;
        }

        if (orderStatus === ORDER_STATUS_CONFIRMED) {
            sprite = <i className="sprite-prepare-active" />;
        }

        return (
            <div className="section">
                <h2 className="section-title">
                    { sprite }
                    方案已确认
                </h2>
                <div className="content">
                    <p className="content-text">已为您分配专属派对管家，管家将于派对开始前7天与您联系</p>
                </div>
            </div>
        );
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
    renderOrderPays () {
        var order = this.props.orderDetail.data;
        var orderPays = order.orderPays;
        var sprite = <i className="sprite-prepare" />;
        var orderPay;

        if (!orderPays || orderPays.length == 0) {
            return null;
        }

        orderPay = _.find(orderPays, (item) => item.payStatus === 100 );

        if (!orderPay) {
            return null;
        }

        if (order.orderStatus === ORDER_STATUS_WAITING_FOR_UPDATE) {
            sprite = <i className="sprite-check-on" />;
        }

        return (
            <div className="section order-info-edit">
                <h2 className="section-title">
                    { sprite }
                    方案调整
                </h2>
                <div className="content order-info">
                    <div className="field">
                        <span>修改信息</span>
                    </div>
                    <div className="field">
                        <dl>
                            <dd className="row flex justify">{ orderPay.remark }</dd>
                        </dl>
                    </div>
                    <div className="field">
                        <p className="total">
                            <span>需支付：</span>
                            <span className="price">
                                <span>¥</span>
                                <em>{orderPay.payAmount}</em>
                            </span>
                            <a href="javascript: void(0);"
                                onClick={ this.goPaymentPage.bind(this) }
                                className={`btn btn-block ${ this.state.submitting ? "btn-gray" : "btn-pink"}`}
                            >去支付</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    createInvitation () {
        var order = this.props.orderDetail.data;
        function jump (invitation) {
            window.location.href = `http://m.party.wanmei.cn/invitation/templates?id=${invitation.id}&sign=${invitation.sign}`;
        }
        BackendAPI.createInvitation({
            orderId: order.id
        }).then(
            (invitation) => {
                jump(invitation);
            },
            (error) => {
                this.refs.toast.show(error.message);
            }
        );
    }
    renderOrderHistory() {
        var order = this.props.orderDetail.data;
        var orderPays = (order.orderPays || [])
            .filter((item) => item.payStatus === 200);

        if (!orderPays) {
            return null;
        }

        return (
            <div className="field">
                <dl>
                    <dt>历史修改</dt>
                    {
                        orderPays.map((item, i) => {
                            return <dd key={i} className="row flex justify">
                                <div className="col-flex">
                                    { item.remark }
                                </div>
                                <div className="col-flex">
                                    ¥{ item.payAmount }
                                </div>
                            </dd>;
                        })
                    }
                </dl>
            </div>
        );
    }
    render () {
        var orderDetail = this.props.orderDetail;
        var themeDetail = this.props.themeDetail;
        var invitationDetail = this.props.invitationDetail;
        var order = orderDetail.data;
        if (this.state.error) {
            return (<Loading message={this.state.error.message} disableAnimate={true} />);
        }

        if (this.state.fetching) {
            return (<Loading />);
        }

        if (orderDetail.data.orderStatus === ORDER_STATUS_UNPAID) {
            return (<UnpaidOrderDetailPage code={ this.state.code } location={ this.props.location }/>);
        }

        var extraAdult = order.partyParentsNumber - order.comboParents;
        var extraChild = order.partyKidsNumber - order.comboKids;
        var butlerNameText = null;
        var butlerPhoneText = null;
        if (order.controlerName) {
            butlerNameText = <p className="contact-name">派对管家：{order.controlerName}</p>;
        } else {
            butlerNameText = <p className="contact-name">完美客服</p>;
        }
        butlerPhoneText = <a href={`tel:${order.controlerPhone || SERVICE_PHONE }`} className="contact-phone">
                              <i className="sprite-phone-large" />
                          </a>;

        var invitationText = null;
        if (invitationDetail.data) {
            invitationText = <a href={`http://m.party.wanmei.cn/invitation/invit/${invitationDetail.data.templateId}?id=${order.invitationId}&sign=${order.invitationSign}`}
              className="btn btn-pink btn-ghost"
              >查看邀请函</a>;
        } else {
            invitationText = <a href="javascript: void(0);"
              className="btn btn-pink btn-ghost"
              onClick = { this.createInvitation.bind(this) }
              >创建邀请函</a>;
        }

        return (
            <div className="page page-order-detail">
                <div className="head row flex middle">
                    <div className="col-flex">
                        { butlerNameText }
                        { invitationText }
                    </div>
                    { butlerPhoneText }
                </div>

                <div className="main">
                    { this.renderCompleteStatus() }
                    { this.renderAlbumStatus() }
                    { this.renderPartyStatus() }
                    { this.renderPreparedStatus() }
                    { this.renderPreparingStatus() }
                    { this.renderConfirmedStatus() }
                    { this.renderOrderPays() }
                    <div className="section">
                        <h2 className="section-title">
                            {
                                (()=>{
                                    if (order.orderStatus === ORDER_STATUS_WAITING_FOR_CONFIRM) {
                                        return <i className="sprite-note-circle-active" />;
                                    } else {
                                        return <i className="sprite-note-circle" />;
                                    }
                                })()
                            }
                           已付款，方案确认中
                        </h2>
                        <div className="content order-info">
                            <div className="field">
                                订单编号：{ order.orderCode }
                            </div>
                            <div className="field row flex">
                                <div className="theme-image">
                                    <ResponsiveImage src={ themeDetail.data.detailImgUrl } />
                                </div>
                                <div className="col-flex">
                                    <h3 className="theme-name">{ themeDetail.data.title }</h3>
                                    <p className="theme-desc">完美{ order.comboName }套餐，含{ order.comboKids }个家庭，小寿星家庭2大1小，其余1大1小</p>
                                </div>
                            </div>
                            <div className="field">
                                <dl>
                                    <dt>订单信息</dt>
                                    <dd className="row flex justify">
                                        <div className="col-flex">套餐价格</div>
                                        <div className="col-flex">¥{order.comboPrice}</div>
                                    </dd>
                                    {
                                        (order.addCommodities || []).map((commodity, i) => {
                                            return (
                                                <dd className="row flex justify" key={i}>
                                                    <div className="col-flex">{commodity.commodityName}</div>
                                                    <div className="col-flex">¥{commodity.commodityPrice}</div>
                                                </dd>
                                            );
                                        })
                                    }
                                    {
                                        (() => {
                                            if (order.addPersonPrice) {
                                                return (
                                                    <dd className="row flex justify">
                                                        <div className="col-flex">套餐外人数(
                                                            { extraAdult ? extraAdult + '大人' + (extraChild?', ':'') : ''}
                                                            { extraChild ? extraChild + '小孩' : ''})
                                                        </div>
                                                        <div className="col-flex">¥{order.addPersonPrice}</div>
                                                    </dd>
                                                );
                                            }
                                        })()
                                    }
                                    {
                                        (() => {
                                            if (order.ticketFee) {
                                                return (
                                                    <dd className="row flex justify">
                                                        <div className="col-flex">优惠券</div>
                                                        <div className="col-flex">-¥{order.ticketFee}</div>
                                                    </dd>
                                                );
                                            }
                                        })()
                                    }
                                </dl>
                            </div>
                            <div className="field">
                                <dl>
                                    <dt>派对信息</dt>
                                    <dd>{ formatDate(order.partyTime) }</dd>
                                    <dd>{ order.placeName }</dd>
                                    <dd>大人{order.partyParentsNumber}人，小孩{order.partyKidsNumber}人</dd>
                                </dl>
                            </div>
                            <div className="field">
                                <dl>
                                    <dt>主人公信息</dt>
                                    <dd>{ order.kidName } { order.kidGender === 1 ? '男': '女' }</dd>
                                    <dd>{ formatDate(order.kidBirthday) }</dd>
                                    {
                                        (() => {
                                            if (order.kidRemark) {
                                                return <dd>{ order.kidRemark }</dd>;
                                            }
                                        })()
                                    }
                                </dl>
                            </div>
                            { this.renderOrderHistory() }
                            <div className="field">
                                <p className="total">
                                    总价：<span className="price">¥<em>{ order.salePrice }</em></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

OrderDetailPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function formatDate (time) {
    time = new Date(time);

    return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getOrderDetail,
        getThemeDetail,
        getInvitationDetail
    }, dispatch)
)(OrderDetailPage);
