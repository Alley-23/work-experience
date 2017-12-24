import React from 'react';
import {connect} from 'react-redux';
import * as util from '../../util';
import Loading from '../../component/Loading';
import Image from '../../component/ResponsiveImage';
import {getSharePhotoFetch, getAlbumShareFetch} from '../../action/album';
import dateFormatter from '../../../lib/date_formatter';

class AlbumSharePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            imageUrlMapping: {},
            isShowShare: false,
            fetching: true
        };
    }

    componentWillReceiveProps(nextProps) {
        var albumShare = nextProps.albumShare;
        var sharePhotoList = nextProps.sharePhotoList;
        if (albumShare.data && sharePhotoList.data) {
            this.shareWx(albumShare.data.album.kidsName, sharePhotoList.data[0]);
        }
    }

    componentDidMount() {
        var id = this.props.params.id;
        var sign = this.props.location.query.sign;
        var albumShare = this.props.albumShare;

        if (!albumShare.meta || albumShare.meta.id !== id || albumShare.meta.sign === sign) {
            this.props.getAlbumShareFetch(id, sign);
        }

        var sharePhotoList = this.props.sharePhotoList;
        if (!sharePhotoList.meta || sharePhotoList.meta.id !== id || sharePhotoList.meta.sign !== sign) {
            this.props.getSharePhotoFetch(id, sign);
        }

        if (this.props.location.query.showMask == 1) {
            this.setState({
                isShowShare: true
            });
            this.context.router.replace({
                pathname: `/account/album/share/${ id }`,
                query: {
                  sign: sign
                }
            });
        }
    }

    shareWx(name, imgUrl) {
        if (util.isWeixin()) {
            util.setWeixinShareConfig({
                title: `${name}小朋友生日相册`,
                desc: '我的完美主题派对，精彩时刻在这里～Let\'s party!',
                imgUrl: imgUrl,
                link: window.location.href
            });
        }
    }

    showImageList() {
        var sharePhotoList = this.props.sharePhotoList;
        var data = sharePhotoList.data;
        return data.map((img, i) => {
            return (<div className="img-bd" onClick={ () => {this.previewImage(img, data);} } key={i}>
                <Image src={img} cut={true}/>
            </div>);
        });
    }

    previewImage(current, urls) {
        let wx = window.wx;
        wx.ready(function () {
            wx.previewImage({
                current, urls
            });
        });
    }

    renderShareMask() {
        if (!this.state.isShowShare) {
            return;
        }
        return (<div ref="mask" className="mask" onTouchMove={(e) => {e.preventDefault();}}
                onClick={
                  () => {
                    this.setState({
                        isShowShare: false
                    });
                  }
                }>
                <a href="javascript:void(0)" className="fc"><i></i></a>
        </div>);
    }

    render() {
        var sharePhotoList = this.props.sharePhotoList;
        var albumShare = this.props.albumShare;
        var album = null;
        if (sharePhotoList.error) {
            return (<Loading message={`阿哦！${sharePhotoList.error}`} disableAnimate={ true }/>);
        }
        if (albumShare.error) {
            return (<Loading message={`阿哦！${albumShare.error}`} disableAnimate={ true }/>);
        }
        if (sharePhotoList.fetching || albumShare.fetching || !sharePhotoList.data || !albumShare.data) {
            return (<Loading />);
        }
        album = albumShare.data.album;

        return (
            <div className="page page-album page-album-detail">
                <p className="tit">{`${album.kidsName}小朋友生日相册 ${dateFormatter(album.partyTime, 'yyyy-mm-dd')}`}</p>
                { this.showImageList() }
                <div className="qrcode"><img src="http://7xrz9e.com2.z0.glb.qiniucdn.com/partyweixin.png"/></div>
                <p className="hot-tell">全国统一服务热线<br/>400-012-8532</p>
                <a href="http://m.party.wanmei.cn/index" className="gt">前往完美主题派对</a>
                { this.renderShareMask() }
            </div>
        );
    }
}

AlbumSharePage.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export default connect(
    (state) => state,
    { getSharePhotoFetch, getAlbumShareFetch }
)(AlbumSharePage);
