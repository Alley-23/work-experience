import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SERVICE_PHONE } from '../../constant';
import * as util from '../../util';
import Image from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import { getComboDetail } from '../../action/combo';
import { clearOrderForm, updateOrderForm } from '../../action/order';

class ComboDetailPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            mounted: false
        };
    }
    componentDidMount () {
        var comboDetail = this.props.comboDetail;
        var comboId = this.props.params.id;

        if (
            (!comboDetail.fetching && !comboDetail.meta) ||
            (comboDetail.data && comboDetail.data.id != comboId)
        ) {
            this.props.getComboDetail({
                comboId
            });
        }

        this.setState({
            mounted: true
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

    renderComboInfo () {
        var comboInfo = this.props.comboDetail.data;
        var star = Number(comboInfo.recommendRate || 0);
        return (
            <div className="item-info">
                <i className="sprite-crown" />
                <h3 className="item-info-title">{ comboInfo.longName }</h3>
                <div className="item-info-row">
                    {
                        (()=> {
                            if (comboInfo.orgShowPrice) {
                                return <span className="combo-price-label">特惠价</span>;
                            }
                        })()
                    }
                    <span className="combo-price">{comboInfo.showPrice}</span>
                    {
                        (()=> {
                            if (comboInfo.orgShowPrice) {
                                return <span className="combo-origin-price">原价 ¥ { comboInfo.orgShowPrice }</span>;
                            }
                        })()
                    }
                </div>
                <div className="item-info-row">
                    <span>推荐指数：</span>
                    <i className={ `sprite-star${ star === 0.5 ? '-half' : (star < 1 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 1.5 ? '-half' : (star < 2 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 2.5 ? '-half' : (star < 3 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 3.5 ? '-half' : (star < 4 ? '-empty' : '') }`} />
                    <i className={ `sprite-star${ star === 4.5 ? '-half' : (star < 5 ? '-empty' : '') }`} />
                </div>
                <div className="item-info-row">
                    适合人群：{ comboInfo.suitable }
                </div>
            </div>
        );
    }

    renderComboProductList () {
        var comboInfo = this.props.comboDetail.data;

        return (
            <div className="combo-product-list">
                <h2 className="title"><em>完美<i />{ comboInfo.name }</em>报价单</h2>
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
                {
                    (() => {
                        if (comboInfo.useRules) {
                            return <dl>
                                <dt><i className="sprite-star-pink" />使用规则</dt>
                                {
                                    comboInfo.useRules.map((item, i) => {
                                        return (
                                            <dd key={i} className={`item-${item.colorFlag}`}>{ item.text }</dd>
                                        );
                                    })
                                }
                            </dl>;
                        }
                    })()
                }

            </div>
        );
    }
    renderComboImages () {
        var comboInfo = this.props.comboDetail.data;
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
                                                <Image
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
    renderFooter () {
        var comboInfo = this.props.comboDetail.data;

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
                                        comboId: comboInfo.id
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
        var comboDetail = this.props.comboDetail;

        if (comboDetail.error) {
            return <Loading message={ comboDetail.error.message } disableAnimate={ true }/>;
        }

        if (!this.state.mounted || comboDetail.fetching || !comboDetail.meta) {
            return <Loading />;
        }

        return (
            <div className="page page-detail page-combo-detail">
                <Image src={ comboDetail.data.detailImgUrl }
                    ratio={ 0.671875 }
                />
                { this.renderComboInfo() }
                { this.renderComboProductList()}
                { this.renderComboImages() }
                { this.renderFooter() }
            </div>
        );
    }
}

ComboDetailPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getComboDetail,
        clearOrderForm,
        updateOrderForm
    }, dispatch)
)(ComboDetailPage);
