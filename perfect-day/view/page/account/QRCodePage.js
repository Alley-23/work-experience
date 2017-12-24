import React from 'react';
import {connect} from 'react-redux';
import Loading from '../../component/Loading';
import {getUserQRCodeFetch} from '../../action/qrcode';

class QRCodePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true
        };
    }

    componentDidMount() {
        let userQRCode = this.props.userQRCode;
        if (userQRCode.data) {
            this.setState({
                fetching: false
            });
        } else {
            this.props.getUserQRCodeFetch();
            this.setState({
                fetching: false
            });
        }
    }

    render() {
        let userQRCode = this.props.userQRCode;
        if (this.state.fetching || userQRCode.loading) {
            return (<Loading />);
        }

        if (userQRCode.err) {
            return (<Loading message={`阿哦！${userQRCode.err}`} disableAnimate={ true }/>);
        }

        return (
            <div className="page page-account-qrcode">
                <div className="my_codes">
                    <p className="userpics">
                        <img src={userQRCode.user.logo}/>
                    </p>
                    <p className="telphone">{userQRCode.user.nickName}</p>
                    <div className="my_codes_pic">
                        <div className="qrcode">
                            <img src={userQRCode.data}/>
                        </div>
                        <p className="wodezhuanshuewm">我的二维码</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => state,
    { getUserQRCodeFetch }
)(QRCodePage);
