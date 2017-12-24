import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SERVICE_PHONE } from '../../constant';

import Image from '../../component/ResponsiveImage';
import Toast from '../../component/Toast';
import { getPlaceList, getPlaceDetail } from '../../action/place';
import { updateOrderForm } from '../../action/order';
import PlaceList from '../index/component/PlaceList';

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

class ChoosePlacePage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            selected: this.props.location.query.placeId
        };
    }
    componentDidMount () {
        var query = this.props.location.query;
        this.props.getPlaceList({
            cityId: query.cityId,
            comboId: query.comboId
        });
    }
    onSelectPlaceDistrict (id) {
        if (id !== this.state.placeDistrictId) {
            this.props.getPlaceList({
                cityId: this.props.location.query.cityId,
                districtId: id,
                placeType: this.props.placeList.meta.placeType
            });
            this.setState({
                placeDistrictId: id
            });
        }
    }
    onSelectPlaceCategory (id) {
        if (id !== this.state.placeCategoryId) {
            this.props.getPlaceList({
                cityId: this.props.location.query.cityId,
                districtId: this.props.placeList.meta.districtId,
                placeType: id
            });

            this.setState({
                placeCategoryId: id
            });
        }
    }
    loadMorePlace () {
        var places = this.props.placeList;
        this.props.getPlaceList({
            cityId: places.meta.cityId,
            districtId: places.meta.districtId,
            placeType: places.meta.placeType,
            page: places.meta.page + 1
        });
    }
    onSelectPlace (id) {
        this.setState({
            selected: id
        });

        this.props.getPlaceDetail({
            placeId: id
        });
    }
    submit () {
        if (!this.state.selected) {
            this.refs.toast.show('请选择一个场地');
            return;
        }

        this.props.updateOrderForm({
            placeId: this.state.selected
        });

        this.context.router.goBack();
    }
    render () {
        return (
            <div className="page page-choose-place">
                <Toast ref="toast" />
                <PlaceList2
                   selected={ this.state.selected }
                   placeList={ this.props.placeList }
                   placeDetail={ this.props.placeDetail }
                   cityId={ this.props.location.query.cityId }
                   onSelectDistrict={ this.onSelectPlaceDistrict.bind(this) }
                   onSelectCategory={ this.onSelectPlaceCategory.bind(this) }
                   onSelectPlace={ this.onSelectPlace.bind(this) }
                   loadMore={ this.loadMorePlace.bind(this) }
                />
                <div className="footer">
                    <a href="javascript: void(0)"
                        className="btn btn-cube btn-pink btn-large btn-block"
                        onClick={
                            () => this.submit()
                        }
                    >确定</a>
                </div>
            </div>
        );
    }
}

ChoosePlacePage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

class PlaceList2 extends PlaceList {
    renderPlaceDetail () {
        var placeDetail = this.props.placeDetail;
        if (placeDetail.error) {
            return <span className="status-text">{ placeDetail.error.message }</span>;
        } else if (placeDetail.data) {
            let detail = placeDetail.data.detailJsonDto;
            if (!detail) {
                return <span className="status-text">无场地详细数据</span>;
            }
            let text = null;
            if (detail.tablesNumRange && detail.personsNumRange) {
                text = <li>{`可容纳桌数：${detail.tablesNumRange.max}桌，大约${detail.personsNumRange.max}人`}</li>;
            }
            let minFeeText = <span className="place-detail-price">0</span>;
            if (detail.minFeeRange) {
              if (detail.minFeeRange.min === detail.minFeeRange.max) {
                  minFeeText = <span className="place-detail-price">{ detail.minFeeRange.min }</span>;
              } else {
                  minFeeText = <span className="place-detail-price">{ detail.minFeeRange.min }~{ detail.minFeeRange.max }</span>;
              }
            }

            return (
                <div className="place-detail">
                    <h4 className="place-detail-title">场地特色</h4>
                      <ul className="place-detail-list">
                          <li>{ PLACE_TEXT_MAP_WIFI[detail.wifiType ? detail.wifiType : 0] }</li>
                          <li>{ PLACE_TEXT_MAP_PARKING[detail.parkingType ? detail.parkingType : 0] }</li>
                          { text }
                          <li>{ PLACE_TEXT_MAP_MEAL[detail.mealType ? detail.mealType : 0] }</li>
                      </ul>
                    <h4 className="place-detail-title">最低消费</h4>
                    { minFeeText }
                    <sub className="place-detail-comment">(套餐外场地的最低消费)</sub>
                    <h4 className="place-detail-title">场地费</h4>
                    <span className="place-detail-price">{ placeDetail.data.placeFee }</span>
                </div>
            );
        } else {
            return <span className="status-text">加载中...</span>;
        }
    }
    renderItems () {
        var placeList = this.props.placeList;
        var end = <span className="status-text">加载中...</span>;
        if (!placeList.data.length && this.props.placeList.fetching || !this.props.placeList.meta) {
            return end;
        }

        if (!placeList.data.length) {
            return <span className="status-text">没有找到相关场馆...</span>;
        }

        if (placeList.data.length >= placeList.meta.total) {
            end = <a href={`tel:${SERVICE_PHONE}`}
                className="btn btn btn-large btn-ghost btn-block btn-colorful service-btn"
            >客服电话：{ SERVICE_PHONE.replace(/^(\d{3})(\d{4})(\d*)$/, '$1-$2-$3') }</a>;
        }

        return (
            <div>
            {
                this.props.placeList.data.map((place, i) => {
                    var isActive = this.props.selected === place.id;
                    var checkbox = <i className="sprite-check-off" />;
                    var placeDetail = null;

                    if (isActive) {
                        checkbox = <i className="sprite-check-on" />;
                        placeDetail = this.renderPlaceDetail();
                    }
                    return (
                        <div className="place-item" key={ i } >
                            <div className="place-info row flex middle"
                                onClick={
                                    () => {
                                        this.props.onSelectPlace(place.id);
                                    }
                                }
                            >
                                <div className="place-image">
                                    <Image
                                        lazyload={ true }
                                        src={ place.imgUrl }
                                    />
                                </div>
                                <div className="col-flex">
                                    <h2 className="place-name">{ place.name }</h2>
                                    <p className="place-address">{ place.address }</p>
                                </div>
                                <div className="checkbox">
                                    { checkbox }
                                </div>
                            </div>
                            { placeDetail }
                        </div>
                    );
                })
            }
            { end }
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getPlaceList,
        getPlaceDetail,
        updateOrderForm
    }, dispatch)
)(ChoosePlacePage);
