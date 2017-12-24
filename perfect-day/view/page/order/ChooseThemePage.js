import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SERVICE_PHONE } from '../../constant';

import Toast from '../../component/Toast';

import { getThemeCategory, getThemeList } from '../../action/theme';
import { updateOrderForm } from '../../action/order';

class ChooseThemePage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            error: null,
            selected: this.props.themeId
        };
    }
    componentDidMount () {
        this.loadData();
    }

    loadData () {
        var props = this.props;
        var query = props.location.query;
        var cityId = query.cityId;
        var comboId = query.comboId;

        props.getThemeList({
            cityId,
            comboId
        });

        props.getThemeCategory();
    }

    onSelectCategory (id) {
        var query = this.props.location.query;
        this.props.getThemeList({
            cityId: query.cityId,
            comboId: query.comboId,
            themeCatalog: id
        });
    }

    loadMoreTheme () {
        var meta = this.props.themeList.meta;

        this.props.getThemeList(_.extend({}, meta, { page: meta.page + 1}));
    }

    submit () {
        if (!this.state.selected) {
            this.refs.toast.show('请选择一个主题');
            return;
        }

        this.props.updateOrderForm({
            themeId: this.state.selected
        });

        this.context.router.goBack();
    }

    render () {
        var themes = this.props.themeList;
        var categorys = this.props.themeCategory;

        return (
            <div className="page page-choose-theme">
                <Toast ref="toast" />
                <Filter
                    themes={ themes }
                    categorys={ categorys }
                    onSelectCategory={ this.onSelectCategory.bind(this) }
                />
                <List themes={ themes }
                    loadMore={ () => this.loadMoreTheme() }
                    onSelectTheme={ (id) => this.setState({ selected: id })}
                    selected={ this.state.selected }
                />
                <a href="javascript:void(0);"
                    className="btn btn-cube btn-pink btn-block btn-large bottom-btn"
                    onClick={ () => this.submit() }
                >确定</a>
            </div>
        );
    }
}

ChooseThemePage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

class Filter extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    onSelectCategory (id) {
        this.props.onSelectCategory(id);
        this.setState({
            categoryId: id
        });
    }
    render () {
        var cates = [{ name: '全部'}];
        var meta = this.props.themes.meta || {};
        var categoryId = meta.themeCatalog;

        if (this.props.categorys.data) {
            cates = cates.concat(this.props.categorys.data);
        }

        return (
            <div className="theme-filter">
                {
                    cates.map((cate, i) => {
                        var className = 'theme-filter-option';
                        if (categoryId === cate.id) {
                            className += ' active';
                        }

                        return (
                            <span
                                key={i}
                                onClick={ () => this.onSelectCategory(cate.id) }
                                className={ className }
                            >{ cate.name }</span>
                        );
                    })
                }
            </div>
        );
    }
}

class List extends React.Component {
    constructor (props) {
        super(props);
        this.onScroll = () => {
            var body = document.body;
            var themes = this.props.themes;

            if (this.state.loadingMore ||
                !themes.data.length ||
                !themes.meta ||
                themes.error) {
                return;
            }

            if (themes.data.length >= themes.meta.total) {
                return;
            }

            if (body.scrollTop + body.clientHeight + 30 >= body.scrollHeight) {
                this.props.loadMore();
                this.setState({
                    loadingMore: true
                });
            }
        };
    }

    componentDidMount () {
        window.addEventListener('scroll', this.onScroll, false);
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, false);
    }
    componentWillReceiveProps() {
        this.setState({
            loadingMore: false
        });
    }

    render () {
        var themes = this.props.themes;
        if (themes.error) {
            return <span className="status-text">{ themes.error.message }</span>;
        }

        if (!themes.meta || themes.fetching && !themes.data.length) {
            return <span className="status-text">加载中...</span>;
        }

        if (!themes.data.length) {
            return <span className="status-text">没有找到相关主题...</span>;
        }

        return (
            <div className="theme-list">
                {
                    themes.data.map((item, i) => {
                        return (
                            <div className="theme-item row flex middle"
                                key={i}
                                onClick={
                                    () => this.props.onSelectTheme(item.id)
                                }
                            >
                                <div className="col-flex">
                                    <h2 className="theme-item-title">{ item.title }</h2>
                                    <p className="theme-item-desc">{ item.description }</p>
                                </div>
                                <div className="check-box">
                                    {
                                        (() => {
                                            if (this.props.selected === item.id) {
                                                return <i className="sprite-check-on"></i>;
                                            } else {
                                                return <i className="sprite-check-off"></i>;
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        );
                    })
                }
                {
                    (() => {
                        if (themes.data.length >= themes.meta.total) {
                            return (
                                <div className="footer">
                                    <span className="status-text">没有喜欢的主题？请拨打电话咨询更多主题！</span>
                                    <a href={`tel:${SERVICE_PHONE}`}
                                        className="btn btn btn-large btn-ghost btn-block btn-colorful service-btn"
                                    >客服电话：{ SERVICE_PHONE.replace(/^(\d{3})(\d{4})(\d*)$/, '$1-$2-$3') }</a>
                                </div>
                            );
                        } else {
                            return (
                                <div className="footer">
                                    <span className="status-text">加载中...</span>
                                </div>
                            );
                        }
                    })()
                }
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getThemeCategory,
        getThemeList,
        updateOrderForm
    }, dispatch)
)(ChooseThemePage);