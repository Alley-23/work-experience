import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

import scrollTo from '../../../lib/scroll_to';

import { SERVICE_PHONE } from '../../constant';

import Toast from '../../component/Toast';
import Loading from '../../component/Loading';

import { getComboList, getComboDetail } from '../../action/combo';
import { updateOrderForm } from '../../action/order';

class ChooseComboPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fetching: false,
            error: null,
            selected: this.props.location.query.comboId
        };

        this.onScroll = () => {
            var body = document.body;
            var combos = this.props.comboList;
            if (combos.fetching ||
                !combos.data.length ||
                !combos.meta ||
                combos.error) {
                return;
            }

            if (combos.data.length >= combos.meta.total) {
                return;
            }

            if (body.scrollTop + body.clientHeight + 30 >= body.scrollHeight) {
                this.loadMore();
            }
        };
    }

    componentDidMount () {
        var query = this.props.location.query;

        this.props.getComboList({
            cityId: query.cityId,
            themeId: query.themeId
        });
        window.addEventListener('scroll', this.onScroll, false);
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    loadMore () {
        var meta = this.props.comboList.meta;

        this.props.getComboList(_.extend({}, meta, { page: meta.page + 1}));
    }

    onSelect (comboId) {
        this.props.getComboDetail({
            comboId
        });
        this.setState({
            selected: comboId
        });
    }

    submit () {
        if (!this.state.selected) {
            this.refs.toast.show('请选择一个套餐');
            return;
        }

        this.props.updateOrderForm({
            comboId: this.state.selected
        });

        this.context.router.goBack();
    }

    renderComboProductList() {
        var comboDetail = this.props.comboDetail;
        return (
            <div className="combo-product-list">
                <h2 className="title"><em>完美<i />定制</em>报价单</h2>
                {
                    (() => {
                        if (comboDetail.error) {
                            return <span className="status-text">
                                { comboDetail.error.message }
                            </span>;
                        } else if (comboDetail.data) {
                            return comboDetail.data.commodityGroups.map((group, i) => {
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
                            });
                        } else {
                            return <span className="status-text">加载中...</span>;
                        }
                    })()
                }
            </div>
        );
    }

    render () {
        var comboList = this.props.comboList;
        if (this.state.error) {
            return <Loading message={ this.state.error.message } disableAnimate={ true }/>;
        }

        if (comboList.fetching && !comboList.meta) {
            return <Loading />;
        }

        return (
            <div className="page page-choose-combo">
                <Toast ref="toast" />
                <div className="combo-list">
                    {
                        this.props.comboList.data.map((combo, i) => {
                            var isSelected = this.state.selected === combo.id;

                            return (
                                <div className="combo-item"
                                    key={ i }
                                    onClick={
                                        (e) => {
                                            var el = e.currentTarget;
                                            if (this.state.selected === combo.id) {
                                                this.setState({
                                                    selected: null
                                                });
                                                return;
                                            }
                                            this.onSelect(combo.id);

                                            setTimeout(() => {
                                                var top = el.getBoundingClientRect().top + document.body.scrollTop;
                                                scrollTo(top);
                                            });
                                        }
                                    }
                                >
                                    <div className="combo-info row flex middle">
                                        <div className="col-flex">
                                            { combo.name }
                                            <span className="combo-price">{ combo.showPrice }</span>
                                        </div>
                                        <div className="checkbox">
                                        {
                                            (() => {
                                                if (isSelected) {
                                                    return <i className="sprite-check-on"></i>;
                                                } else {
                                                    return <i className="sprite-check-off"></i>;
                                                }
                                            })()
                                        }
                                        </div>
                                    </div>
                                    {
                                        (() => {
                                            if (isSelected) {
                                                return this.renderComboProductList(combo);
                                            }
                                        })()
                                    }
                                </div>
                            );
                        })
                    }
                    { comboList.fetching && <div className="status-text">加载中...</div> }
                </div>

                <a href={`tel:${SERVICE_PHONE}`}
                    className="btn btn btn-large btn-ghost btn-block btn-colorful service-btn"
                >客服电话：{ SERVICE_PHONE.replace(/^(\d{3})(\d{4})(\d*)$/, '$1-$2-$3') }</a>

                <div className="footer">
                    <a href="javascript: void(0)"
                        onClick={
                            () => this.submit()
                        }
                        className="btn btn-cube btn-large btn-pink btn-block"
                    >确认</a>
                </div>
            </div>
        );
    }
}

ChooseComboPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getComboList,
        getComboDetail,
        updateOrderForm
    }, dispatch)
)(ChooseComboPage);
