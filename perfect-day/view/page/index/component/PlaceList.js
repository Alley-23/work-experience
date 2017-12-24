import React from 'react';
import _ from 'underscore';
import { Link } from 'react-router';

import Promise from '../../../../lib/promise';
import scrollTo from '../../../../lib/scroll_to';
import * as BackendAPI from '../../../../lib/backend_api';

import Image from '../../../component/ResponsiveImage';
import ScrollView from '../../../component/ScrollView';


const CATE_PANNEL = 'CATE_PANNEL';
const AREA_PANNEL = 'AREA_PANNEL';

class PlaceList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            categoryName: '',
            districtName: ''
        };
        this.onScroll = () => {
            var body = document.body;
            var places = this.props.placeList;

            if (this.state.loadingMore || !places.data.length || !places.meta) {
                return;
            }

            if (places.data.length >= places.meta.total) {
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
    componentDidMount() {
        Promise.all([
            BackendAPI.getPlaceCategory(),
            BackendAPI.getPlaceDistrict({ cityId: this.props.cityId })
        ]).then((rets) => {
            if (this.onOptionsLoad) {
                this.onOptionsLoad(rets[0], rets[1]);
            }
        });

        window.addEventListener('scroll', this.onScroll, false);
    }
    componentWillUnmount() {
        this.onOptionsLoad = null;
        window.removeEventListener('scroll', this.onScroll, false);
    }
    componentWillReceiveProps () {
        this.setState({
            loadingMore: false
        });
    }
    onOptionsLoad(category, district) {
        this.setState({
            category,
            district,
            loading: false
        });
    }
    togglePannel (panel) {
        var top = this.refs.root.getBoundingClientRect().top;
        if (panel !== this.state.panel) {
            scrollTo(window.document.body.scrollTop + top + 2);
        }
        this.setState({
            panel: panel === this.state.panel ? null : panel
        });
    }
    selectDistrict(id, districtName) {
        this.setState({
            districtId: id,
            panel: null,
            districtName
        });
        this.props.onSelectDistrict(id);
    }
    selectCategory(id, categoryName) {
        this.setState({
            cateId: id,
            categoryName,
            panel: null
        });
        this.props.onSelectCategory(id);
    }
    renderFilter() {
        var meta = this.props.placeList.meta || {};
        var districtId = meta.districtId;
        var categoryId = meta.placeType;
        var selectedDistrict = _.find(this.state.district || [], (item) => {
            return item.id === districtId;
        }) || {name: '全城'};
        var selectedCategory = _.find(this.state.category || [], (item) => {
            return item.id === categoryId;
        }) || {name: '全部分类'};

        var catePanelClassName = 'place-filter-title col-6';
        var areaPanelClassName = catePanelClassName;
        if (this.state.panel === CATE_PANNEL) {
            catePanelClassName += ' active';
        } else if (this.state.panel === AREA_PANNEL) {
            areaPanelClassName += ' active';
        }

        return (
            <div className="place-filter row"
                onTouchMove={
                    (e)=> {
                        if (this.state.panel) {
                            e.preventDefault();
                        }
                    }
                }
            >
                <div
                    className={ catePanelClassName }
                    onClick={ ()=> this.togglePannel(CATE_PANNEL) }
                    ref={ CATE_PANNEL }
                >{ selectedCategory.name }</div>
                <div className={ areaPanelClassName }
                    onClick={ ()=> this.togglePannel(AREA_PANNEL) }
                    ref={ AREA_PANNEL }
                >{ selectedDistrict.name }</div>
            </div>
        );
    }
    renderItems() {
        var places = this.props.placeList;
        var end = <span className="status-text">加载中...</span>;

        if (!places.data.length && places.fetching || !places.meta) {
            return end;
        }

        if (!places.data.length) {
            return <span className="status-text">没有找到相关场馆...</span>;
        }

        if (places.data.length >= places.meta.total) {
            end = <span className="status-text">加载完成</span>;
        }

        return (
            <div>
            {
                this.props.placeList.data.map((place, i) => {
                    return (
                        <Link className="place-item row flex middle"
                            key={ i }
                            to={{ pathname: `/place/${ place.id }`}}
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
                        </Link>
                    );
                })
            }
            { end }
            </div>
        );
    }
    renderPanel() {
        var className = 'place-filter-panel';
        var all = [{ name: '全部'}];
        var meta = this.props.placeList.meta || {};
        var districtId = meta.districtId;
        var categoryId = meta.placeType;
        if (this.state.panel) {
            className += ' active';
        }

        return (
            <div className={ className }
                ref="mask"
                onClick={
                    (e) => {
                        if (e.target === this.refs.mask) {
                            this.setState({ panel: null });
                        }
                    }
                }
                onTouchMove={ (e)=>e.preventDefault() }
            >
                <ScrollView className="place-filter-options-wrapper">
                    <ul className="place-filter-options">
                    {
                        (() => {
                            if (this.state.loading) {
                                return (
                                    <li className="place-filter-option">加载中...</li>
                                );
                            } else if ( this.state.panel === AREA_PANNEL) {
                                return all.concat(this.state.district).map((row, i) => {
                                    var isActive = row.id === districtId ? ' active' : '';

                                    return <li className={`place-filter-option${isActive}`}
                                        key={ i }
                                        onClick={
                                            () => this.selectDistrict(row.id, row.id ? row.name : null)
                                        }
                                    >{ row.name }</li>;
                                });
                            } else {
                                return all.concat(this.state.category).map((row, i) => {
                                    var isActive = row.id === categoryId ? ' active' : '';

                                    return <li className={`place-filter-option${isActive}`}
                                        key={ i }
                                        onClick={
                                            () => this.selectCategory(row.id, row.id ? row.name : null)
                                        }
                                    >{ row.name }</li>;
                                });
                            }
                        })()
                    }
                    </ul>
                </ScrollView>
            </div>
        );
    }
    render () {
        return (
            <div className="place-list" ref="root">
                { this.renderFilter() }
                { this.renderPanel() }
                { this.renderItems() }
            </div>
        );
    }
}

export default PlaceList;