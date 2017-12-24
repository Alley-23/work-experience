import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import * as BackendAPI from '../../../lib/backend_api';
import { SERVICE_PHONE_FORMATTED } from '../../constant';
import Loading from '../../component/Loading';
import { getOrderDetail } from '../../action/order';

class PaymentStatusPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fetching: true,
            error: null
        };
    }
    componentDidMount () {
        var code = this.props.params.code;
        if (
            this.props.orderDetail.data &&
            this.props.orderDetail.meta.code == code
        ) {
            this.setState({
                fetching: false
            });
        } else {
            this.props.getOrderDetail(code);
        }
    }
    componentWillReceiveProps (props) {
        if (props.orderDetail.error) {
            this.setState({
                error: props.orderDetail.error
            });
        } else if (
            props.orderDetail.data &&
            props.orderDetail.meta.code === this.props.params.code
        ) {
            this.setState({
                fetching: false
            });
        }
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
    render () {
        var order = this.props.orderDetail.data;
        if (this.state.error) {
            return <Loading message={ this.state.error.message } disableAnimate={ true }/>;
        }

        if (this.state.fetching) {
            return <Loading />;
        }

        return (
            <div className="page page-payment-status">
                <div className="status-text">
                    <i className="sprite-check-on" />
                    支付成功！
                </div>
                <p className="remind">
                    稍后您的专属派对管家将与您联系<br />
                    请保持电话畅通
                </p>
                <div className="row flex center">
                    <div className="col-5">
                        <Link to={`/order/${order.orderCode}`}
                            className="btn btn-block btn-ghost btn-pink btn-middle"
                        >查看订单</Link>
                    </div>
                    <div className="col-5">
                        <a className="btn btn-block btn-pink btn-middle"
                            href="javascript: void(0);"
                            onClick = { this.createInvitation.bind(this) }
                        >邀请小伙伴</a>
                    </div>
                </div>
                <p className="footer">
                    客服电话：<em>{ SERVICE_PHONE_FORMATTED }</em>
                </p>
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getOrderDetail }, dispatch)
)(PaymentStatusPage);