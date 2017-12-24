import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getInvitationList } from '../../action/invitation';
import Loading from '../../component/Loading';
import Util from '../../util';
import dateFormatter from '../../../lib/date_formatter';

class InvitationListPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            fetching: false,
            error: null
        };
    }
    componentDidMount () {
        this.props.getInvitationList();
    }
    componentWillReceiveProps (props) {
        if (props.invitationList.error && Util.isNeedLoginError(props.invitationList.error)) {
            Util.loginToWeixin();
        }
    }
    goInvitationDetailPage (item) {
        this.setState({
            pending: true
        });
        window.location.href = `http://m.party.wanmei.cn/invitation/invit/${item.templateId}?id=${item.id}&sign=${item.sign}`;
    }
    goInvitationRecordPage (item) {
        var url = `http://m.party.wanmei.cn/invitation/record/${item.templateId}?id=${item.id}&sign=${item.sign}`;

        this.setState({
            pending: true
        });

        window.location.href = url;
    }
    render () {
        if (this.props.invitationList.error) {
            return (<Loading message={ this.props.invitationList.error.message } disableAnimate={ true } />);
        }

        if (this.props.invitationList.fetching || !this.props.invitationList.data || this.state.jumping) {
            return (<Loading />);
        }

        if (this.state.jumping) {
            return (<Loading message="跳转中..." />);
        }

        if (!this.props.invitationList.data.length) {
            return (<Loading message="您还未创建邀请函..." disableAnimate={ true }/>);
        }

        return (
            <div className="page page-invitation-list">
                <div className="invitation-item-list">
                    {
                        this.props.invitationList.data.map((item, i) => {
                            return (
                                <div className="invitation-item" key={i}
                                    onClick={ this.goInvitationDetailPage.bind(this, item) }
                                >
                                    <h2 className="title"><i className="sprite-heart" />{ item.babyName }生日邀请函 {dateFormatter(item.beginTime, 'yyyy-mm-dd')}</h2>
                                    <h4 className="place">{ item.place }</h4>
                                    <span className="btn btn-pink btn-ghost btn-middle"
                                        onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                this.goInvitationRecordPage(item);
                                            }
                                        }
                                    >
                                        邀请进度
                                    </span>
                                    <i className="fi fi-angle-right" />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({getInvitationList}, dispatch)
)(InvitationListPage);
