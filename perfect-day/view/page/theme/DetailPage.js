import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';

import { SERVICE_PHONE } from '../../constant';

import { getThemeDetail } from '../../action/theme';
import { getComboList } from '../../action/combo';
import { clearOrderForm } from '../../action/order';

import ComboList from './component/ComboList';
import Loading from '../../component/Loading';
import ResponsiveImage from '../../component/ResponsiveImage';

import * as util from '../../util.js';

class ThemeDetailPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            cityId: util.getCityId(props.location.query),
            themeId: props.params.id,
            fetching: true
        };
    }
    componentDidMount () {
        var themeDetailFetched = true;
        var comboListFetched = true;
        var themeId = this.props.params.id;
        var cityId = this.state.cityId;

        if (
            !this.props.themeDetail.data ||
            this.props.themeDetail.data.id != themeId
        ) {
            this.props.getThemeDetail({
                themeId: this.state.themeId,
                cityId: this.state.cityId
            });
            themeDetailFetched = false;
        }

        if (
            !this.props.comboList.data ||
            this.props.comboList.meta.themeId != themeId ||
            this.props.comboList.meta.cityId != cityId
        ) {
            this.props.getComboList({
                themeId: this.state.themeId,
                cityId: this.state.cityId
            });

            comboListFetched = false;
        }

        this.setState({
            fetching: !themeDetailFetched || !comboListFetched
        });
    }
    componentWillReceiveProps (nextProps) {
        if (!nextProps.themeDetail.fetching && !nextProps.comboList.fetching) {
            this.setState({
                fetching: false
            });

            if (util.isWeixin()) {
                util.setWeixinShareConfig({
                    title: nextProps.themeDetail.data.title,
                    desc: '完美主题派对，所有关于王子、公主的童话梦，我们一起实现',
                    imgUrl: nextProps.themeDetail.data.detailImgUrl,
                    link: window.location.href
                });
            }
        }
    }

    componentWillUnmount() {
        util.defaultWxShare();
    }

    getComboInfo () {
        var comboId = this.state.comboId;

        if (!comboId) {
            return this.props.comboList.data[0];
        } else {
            return _.find(this.props.comboList.data, (combo) => {
                return combo.id == comboId;
            });
        }
    }

    onComboChange (comboId) {
        this.setState({
            comboId
        });
    }
    wxPreviewImage (group, index) {
        var urls = group.imgUrls.map((img) => img.url);

        if (util.isWeixin()) {
            window.wx.previewImage({
                current: urls[index],
                urls
            });
        }
    }
    renderComboInfo (comboInfo) {
        var star = comboInfo.recommendRate;

        return (
            <div className="combo-info">
                <i className="sprite-crown" />
                <h3 className="combo-info-title">{ comboInfo.longName }</h3>
                <p className="combo-info-desc">{ comboInfo.description }</p>
                <div className="combo-info-row">
                    <span>推荐指数：</span>
                    <i className={ `sprite-star${ star === 0.5 ? '-half' : (star < 1 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 1.5 ? '-half' : (star < 2 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 2.5 ? '-half' : (star < 3 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 3.5 ? '-half' : (star < 4 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 4.5 ? '-half' : (star < 5 ? '-empty' : '') }`} />
                </div>
                <div className="combo-info-row">
                    适合人群：{ comboInfo.suitable }
                </div>
                <div className="combo-info-row-hot">{ comboInfo.adKeyWord }</div>
            </div>
        );
    }
    renderComboImages (comboInfo) {
        return (
            <div>
                {
                    comboInfo.showInfo.map((group, i) => {
                        return (
                            <div className="combo-image-section" key={i}>
                                <h3 className="combo-image-section-title">完美<em>{ group.title.replace('完美-', '')}</em></h3>
                                {
                                    group.imgUrls.map((img, i) => {
                                        return (
                                            <div key={i} onClick={ this.wxPreviewImage.bind(this, group, i) } className="combo-image">
                                                <ResponsiveImage
                                                    src={ img.url }
                                                    lazyload={ true }
                                                />
                                                {
                                                    (() => {
                                                        if (img.description) {
                                                            return (<p className="combo-image-desc">{ img.description }</p>);
                                                        }
                                                    })()
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>

        );
    }
    renderComboProductList (comboInfo) {
        return (
            <div className="combo-product-list">
                <h2 className="title"><em>完美<i />定制</em>报价单</h2>
                {
                    comboInfo.commodityGroups.map((group, i) => {
                        return (
                            <dl key={i}>
                                <dt><i className="sprite-star-pink" />{ group.groupName }</dt>
                                {
                                    group.commodities.map((item, i) => {
                                        return (
                                            <dd key={i} className={`item-${item.colorFlag}`}>{ item.name }</dd>
                                        );
                                    })
                                }
                            </dl>
                        );
                    })
                }
            </div>
        );
    }
    renderFooter (comboInfo) {
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
                                this.props.clearOrderForm();
                                this.context.router.push({
                                    pathname: '/checkout',
                                    query: {
                                        comboId: comboInfo.id,
                                        cityId: this.state.cityId,
                                        themeId: this.state.themeId
                                    }
                                });
                            }}
                        >立即购买</a>
                    </div>
                </div>
            </div>
        );
    }
    render () {
        var themeDetail = this.props.themeDetail.data;
        if (this.state.fetching) {
            return (<Loading />);
        }
        var comboInfo = this.getComboInfo();
        return (
            <div className="page page-theme-detail">
                <ResponsiveImage src={ themeDetail.detailImgUrl } />
                <ComboList
                    combos={ this.props.themeDetail.data.combos }
                    comboId={ comboInfo.id }
                    onSelectCombo={ this.onComboChange.bind(this) }
                />
                { this.renderComboInfo(comboInfo) }
                { this.renderComboImages(comboInfo) }
                { this.renderComboProductList(comboInfo) }
                <a className="case-list-btn" href={ themeDetail.historyUrl }>
                    查看过往派对
                </a>
                { this.renderFooter(comboInfo) }
            </div>
        );
    }
}

ThemeDetailPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getThemeDetail,
        getComboList,
        clearOrderForm
    }, dispatch)
)(ThemeDetailPage);
