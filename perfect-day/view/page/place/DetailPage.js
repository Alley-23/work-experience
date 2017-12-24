import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Image from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import { SERVICE_PHONE } from '../../constant';
import * as util from '../../util';
import { getPlaceDetail } from '../../action/place';
import { clearOrderForm, updateOrderForm } from '../../action/order';

const PLACE_TEXT_MAP_WIFI = {
    '1': '现场有免费Wi-Fi',
    '0': '无Wi-Fi'
};
const PLACE_TEXT_MAP_PARKING = {
    '0': '无停车场',
    '1': '有收费停车场',
    '2': '有免费停车场'
};
const PLACE_TEXT_MAP_MEAL = {
    '0': '不提供餐点',
    '1': '提供中餐',
    '2': '提供西餐',
    '3': '提供中餐和西餐'
};

class PlaceDetailPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            mounted: false
        };
    }
    componentDidMount () {
        var placeDetail = this.props.placeDetail;
        var placeId = this.props.params.id;

        if (
            (!placeDetail.fetching && !placeDetail.meta) ||
            (placeDetail.data && placeDetail.data.id != placeId)
        ) {
            this.props.getPlaceDetail({
                placeId
            });
        }

        this.setState({
            mounted: true
        });
    }
    wxPreviewImage (images, index) {
        var urls = images.map((img) => img.url);

        if (util.isWeixin()) {
            window.wx.previewImage({
                current: urls[index],
                urls
            });
        }
    }

    renderPlaceInfo () {
        var placeInfo = this.props.placeDetail.data;
        var detail = placeInfo.detailJsonDto;
        var featureList = [];
        var featureListEl = null;
        if (detail) {
            if (detail.wifiType) {
                featureList.push(PLACE_TEXT_MAP_WIFI[detail.wifiType]);
            }
            if (detail.parkingType) {
                featureList.push(PLACE_TEXT_MAP_PARKING[detail.parkingType]);
            }
            if (detail.tablesNumRange && detail.personsNumRange) {
                featureList.push(`可容纳桌数：${detail.tablesNumRange.max}桌，大约${detail.personsNumRange.max}人`);
            }
            if (detail.mealType) {
                featureList.push(PLACE_TEXT_MAP_MEAL[detail.mealType]);
            }
            var featureListLi = featureList.map((feature, i) => {
                return <li key={i}>{ feature }</li>;
            });
            if (featureList.length > 0) {
                featureListEl = (<div className="item-info-row">
                    <ul className="place-detail">
                        { featureListLi }
                    </ul>
                </div>);
            } else {
                featureListEl = null;
            }
        }
        return (
            <div className="item-info">
                <i className="sprite-crown" />
                <h3 className="item-info-title">{ placeInfo.name }</h3>
                <div className="item-info-row">
                    <span className="place-address">地址：{ placeInfo.address }</span>
                    {
                        (() => {
                            if (placeInfo.placeFee) {
                                return <span className="place-detail-price">
                                    { placeInfo.placeFee}
                                </span>;
                            }
                        })()
                    }
                </div>
                { featureList.length > 0 && <i className="sprite-crown" /> }
                { featureList.length > 0 && <h3 className="item-info-title">场地特色</h3> }
                { featureListEl }
                {
                    (()=> {
                        if (detail && detail.placeFeeRange ) {
                            return <div>
                                <i className="sprite-crown" />
                                <h3 className="item-info-title">场地费</h3>
                                <div className="item-info-row">
                                    <span className="place-detail-price">¥<em>{detail.placeFeeRange.min}</em></span>
                                    <span className="comment-text">（场地费不包含在套餐内，部分场地不同人数收费不同，请联系客服以确认最终场地费）</span>
                                </div>
                            </div>;
                        } else if (detail && detail.minFeeRange) {
                            return <div>
                                <i className="sprite-crown" />
                                <h3 className="item-info-title">最低消费</h3>
                                <div className="item-info-row">
                                    <span className="place-detail-price">¥<em>{detail.minFeeRange.min}</em></span>
                                    <span className="comment-text">（低销不包含在套餐内，部分场地低销费用按人数变动，请联系客服以确认最终低销金额）</span>
                                </div>
                            </div>;
                        }
                    })()
                }
            </div>
        );
    }

    renderImages () {
        var images = this.props.placeDetail.data.detailImgUrls || [];
        return (
            <div className="place-image-section">
                <h3 className="place-image-section-title"><i className="sprite-crown" />场地介绍</h3>
                {
                    images.map((image, i) => {
                        return (
                            <div key={i} onClick={ () => this.wxPreviewImage(images, i) } className="place-image">
                                <Image
                                    src={ image.url }
                                    lazyload={ true }
                                />
                                {
                                    (() => {
                                        if (image.description) {
                                            return (<p className="place-image-desc">{ image.description }</p>);
                                        }
                                    })()
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    renderFooter () {
        return (
            <div className="foot-wrapper">
                <div className="foot row flex">
                    <div className="col-6">
                        <a href={`tel:${ SERVICE_PHONE }`}
                             className="btn btn-cube btn-large btn-block btn-blue">
                            咨询客服
                        </a>
                    </div>
                    <div className="col-6">
                        <a className="btn btn-cube btn-large btn-block btn-pink"
                            href="javascript: void(0);"
                            onClick={ () => {
                                this.context.router.push({
                                    pathname: '/checkout',
                                    query: {
                                        placeId: this.props.placeDetail.data.id
                                    }
                                });
                            }}
                        >立即预订</a>
                    </div>
                </div>
            </div>
        );
    }
    render () {
        var placeDetail = this.props.placeDetail;
        if (placeDetail.error) {
            return <Loading message={ placeDetail.message } disableAnimate={ true }/>;
        }

        if (!this.state.mounted || placeDetail.fetching || !placeDetail.meta) {
            return <Loading />;
        }

        return (
            <div className="page page-detail page-place-detail">
                <Image src={  placeDetail.data.placeImgUrl } ratio={ .671875 } />
                { this.renderPlaceInfo() }
                { this.renderImages() }
                { this.renderFooter() }
            </div>
        );
    }
}

PlaceDetailPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getPlaceDetail,
        clearOrderForm,
        updateOrderForm
    }, dispatch)
)(PlaceDetailPage);
