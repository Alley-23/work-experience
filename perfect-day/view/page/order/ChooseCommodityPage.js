import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

import { getCommodityList } from '../../action/commodity';
import { updateOrderForm } from '../../action/order';
import ResponsiveImage from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import * as util from '../../util';

class ChooseCommodityPage extends React.Component {
    constructor (props) {
        var cityId = util.getCityId(props.location.query);
        var comboId = props.location.query.comboId;
        var meta = props.commodityList.meta;
        super(props);
        this.state = {
            cityId,
            comboId
        };

        if (meta && meta.cityId === cityId && meta.comboId === comboId) {
            this.state.fetching = false;
        } else {
            this.state.fetching = true;

            props.getCommodityList({
                cityId: cityId,
                comboId
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.commodityList.error) {
            this.setState({
                error: nextProps.commodityList.error
            });
        } else if (
            !nextProps.commodityList.fetching &&
            nextProps.commodityList.meta &&
            nextProps.commodityList.meta.cityId === this.state.cityId &&
            nextProps.commodityList.meta.comboId === this.state.comboId
        ) {
            this.setState({
                fetching: false
            });
        }
    }

    toggleCommodity (item) {
        var commodities = this.props.orderForm.commodities || [];
        var isExist = _.find(commodities, function (commodity) {
            return commodity.id === item.id;
        });

        if (isExist) {
            commodities = commodities.reduce(function (ret, curr) {
                if (curr.id !== item.id) {
                    ret.push(curr);
                }
                return ret;
            }, []);
        } else {
            commodities.push(item);
        }
        this.props.updateOrderForm({
            commodities
        });
    }

    render () {
        var commodities = this.props.orderForm.commodities || [];
        if (this.state.fetching) {
            return (<Loading />);
        }
        return (
            <div className="page page-choose-commodity">
                {
                    this.props.commodityList.data.map((item, i) => {
                        var checkbox = (<i className="sprite-check-off" />);
                        var isExist = _.find(commodities, function (commodity) {
                            return commodity.id === item.id;
                        });

                        if (isExist) {
                            checkbox = (<i className="sprite-check-on" />);
                        }
                        return (
                            <div className="commodity-item" key={i}
                                onClick={ () => this.toggleCommodity(item) }
                            >
                                <div className="row flex">
                                    <div className="commodity-image">
                                        <ResponsiveImage src={ item.imgUrl } ratio={ 1 } cut={ true }></ResponsiveImage>
                                    </div>
                                    <div className="col-flex">
                                        <h2 className="commodity-name">{ item.name }</h2>
                                        <p className="commodity-desc">{ item.description }</p>
                                        <span className="commodity-price">¥<em>{ item.salePrice }</em></span>
                                    </div>
                                    <div className="check-box">
                                        { checkbox }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }

                <div className="footer">
                    <div className="footer-wrapper">
                        <a href="javascript: void(0)"
                            className="btn btn-pink btn-cube btn-large btn-block"
                            onClick={
                                () => this.context.router.goBack()
                            }
                        >确定</a>
                    </div>
                </div>
            </div>
        );
    }
}

ChooseCommodityPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getCommodityList, updateOrderForm }, dispatch)
)(ChooseCommodityPage);
