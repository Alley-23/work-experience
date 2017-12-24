import React from 'react';
import {connect} from 'react-redux';
import * as util from '../../util';
import Loading from '../../component/Loading';
import Image from '../../component/ResponsiveImage';
import {getPhotoDetailFetch} from '../../action/album';
import dateFormatter from '../../../lib/date_formatter';
import {createAlbumShare} from '../../../lib/backend_api';
import _ from 'underscore';
import Toast from '../../component/Toast';

const MAX_SHARE_COUNT = 9;

class AlbumDetailPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.params.id,
            sign: this.props.location.query.sign,
            isShowShare: false,
            submiting: false,
            selectedIds: []
        };
    }

    componentDidMount() {
        var photoDetail = this.props.photoDetail;
        if (!photoDetail.meta || photoDetail.meta.id !== this.state.id || photoDetail.meta.sign !== this.state.sign) {
            this.props.getPhotoDetailFetch(this.state.id, this.state.sign);
        }
    }

    componentWillUnmount() {
        util.defaultWxShare();
    }

    previewImage(current, urls) {
        let wx = window.wx;
        wx.ready(function () {
            wx.previewImage({
                current, urls
            });
        });
    }

    shareWx(name, imgUrl, shareUrl) {
        if (util.isWeixin()) {
            util.setWeixinShareConfig({
                title: `${name}小朋友生日相册`,
                desc: '我的完美主题派对，精彩时刻在这里～Let\'s party!',
                imgUrl: imgUrl,
                link: shareUrl
            });
        }
    }

    selectImage(current) {
        var index = this.state.selectedIds.indexOf(current.id);
        if (index >= 0) {
            this.setState({
                selectedIds: _.without(this.state.selectedIds, current.id)
            });
            return;
        }

        if (this.state.selectedIds.length >= MAX_SHARE_COUNT) {
            this.refs.toast.show(`最多选择${MAX_SHARE_COUNT}张照片`);
            return;
        }
        this.setState({
            selectedIds: this.state.selectedIds.concat([current.id])
        });
    }

    startSelectImage() {
        this.setState({
            selectable: true
        });
    }

    completeSelectImage() {
        if (this.state.selectedIds.length < 1) {
            return;
        }
        var imagesIds = this.state.selectedIds;
        var albumId = this.props.params.id;
        this.setState({
            submiting: true
        });
        createAlbumShare(albumId, imagesIds)
            .then( (data) => {
                var shareUrl = `http://m.party.wanmei.cn/account/album/share/${data.id}?sign=${data.sign}&showMask=1`;
                window.location.href = shareUrl;
            })
            .catch( (error) => {
                this.setState({
                    submiting: false
                });
                if (error) {
                    this.refs.toast.show(error.message);
                }
            });
    }

    renderImageList() {
        var photoDetail = this.props.photoDetail;
        var data = photoDetail.data;
        var images = data.images.map((img, i) => {
            var index = this.state.selectedIds.indexOf(img.id);
            var checkEl = null;
            if (index >= 0) {
                checkEl = (<a href="javascript:void(0)" className="icon icon-check-on"></a>);
            } else if (this.state.selectable) {
                checkEl = (<a href="javascript:void(0)" className="icon icon-check-off"></a>);
            }
            return (
                <div className="m-sub" onClick={ () => {this.state.selectable ? this.selectImage(img) : this.previewImage(img.url, data.imageUrls);}} key={i}>
                    <Image src={img.url} cut={true}/>
                    { checkEl }
                </div>
            );
        });
        var contentClass = "content";
        if (this.state.selectable) {
            contentClass = "content album-select";
        }

        return (<div className={contentClass}>
            {images}
        </div>);
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

    renderOperationBar() {
        var button = null;
        if (!this.state.selectable) {
            button = (<div className="fixed-bottom-pink" onClick={this.startSelectImage.bind(this)} >分享该相册</div>);
        } else {
            var selectedCount = this.state.selectedIds.length;
            var confirmText = `确认(${selectedCount}/${MAX_SHARE_COUNT})`;
            var btnStateClass = "confirm pink";
            if (selectedCount < 1) {
                btnStateClass = "confirm";
            }
            button = (<div className="fixed-bottom-white"><span className="fs">{`请选择照片，最多选${MAX_SHARE_COUNT}张`}</span><a href="javascript:void(0)" onClick={this.completeSelectImage.bind(this)} className={btnStateClass}>{confirmText}</a></div>);
        }
        return (<div className="fixed-bottom">
            {button}
        </div>);
    }

    render() {
        var photoDetail = this.props.photoDetail;
        var data = null;
        if (photoDetail.error) {
            return (<Loading message={`阿哦！${photoDetail.error}`} disableAnimate={ true }/>);
        }
        if (photoDetail.fetching || !photoDetail.data || this.state.submiting) {
            return (<Loading />);
        }
        data = photoDetail.data;

        return (
            <div className="page page-album page-album-detail">
                <Toast ref="toast" />
                <p className="tit">{`${data.kidsName}小朋友生日相册 ${dateFormatter(data.partyTime, 'yyyy-mm-dd')}`}</p>
                {this.renderImageList()}
                <div className="ft">
                    下载说明
                    <p className="equal-table"><span className="num">1.</span><span className="de">点击查看大图，长按图片选择保存至本地。</span></p>
                    <p className="equal-table"><span className="num">2.</span><span className="de">该相册图片分辨率适配于网络，如需原图请联系您的派对管家。</span></p>
                </div>
                {this.renderOperationBar()}
                {this.renderShareMask()}
            </div>
        );
    }
}

export default connect(
    (state) => state,
    { getPhotoDetailFetch }
)(AlbumDetailPage);
