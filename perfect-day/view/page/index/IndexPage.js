import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

import { getThemeList, getThemeCategory } from '../../action/theme';
import { getBanner } from '../../action/banner';
import { getComboList } from '../../action/combo';
import { getPlaceList } from '../../action/place';
import { setCityInfo, getCityInfo } from '../../action/city';
import { clearOrderForm, updateOrderForm } from '../../action/order';

import TabBar from '../../component/TabBar';
import CitySelector from './component/CitySelector';
import Banner from './component/Banner';
import Loading from '../../component/Loading';

import Recommend from './component/Recommend';
import Tab from './component/Tab';
import ThemeList from './component/ThemeList';
import PlaceList from './component/PlaceList';
import ComboList from './component/ComboList';

import * as util from '../../util';

const TABS = ["选套餐", "淘主题", "挑场地"];

class IndexPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tab: 0,
            mounted: false,
            themeCategoryId: undefined,
            placeDistrictId: undefined
        };
    }
    componentDidMount () {
        var cityId = this.props.location.query.cityId;

        if (util.isWeixin()) {
            util.defaultWxShare();
        }

        if (cityId) {
            this.props.setCityInfo({
                cityId
            });
            this.ensureData(cityId);
        } else {
            this.props.getCityInfo();
        }
        this.setState({
            mounted: true
        });
    }
    componentWillReceiveProps (props) {
        if (
            (
                !this.props.city.data &&
                !this.props.location.query.cityId &&
                props.city.data
            ) ||
            (
                this.props.city.data &&
                props.city.data &&
                props.city.data.id !== this.props.city.data.id &&
                props.city.data.id !== this.props.location.query.cityId
            )
        ) {
            this.ensureData(props.city.data.id);
        }
    }
    ensureData (cityId) {
        var props = this.props;
        var banners = props.banner;
        var combos = props.comboList;
        var themes = props.themeList;
        var places = props.placeList;
        var themeCategory = props.themeCategory;

        if (!banners.fetching && !banners.meta || banners.meta.cityId !== cityId) {
            props.getBanner({
                cityId
            });
        }

        if (!themes.fetching && !themes.meta ||
            themes.meta.cityId !== cityId ||
            themes.meta.comboId
        ) {
            props.getThemeList({
                cityId
            });
        }

        if (!combos.fetching && !combos.meta ||
            combos.meta.cityId !== cityId ||
            combos.meta.themeId
        ) {
            props.getComboList({
                cityId
            });
        }

        if (!places.fetching && !places.meta ||
            places.meta.cityId !== cityId ||
            places.meta.comboId
        ) {
            props.getPlaceList({
                cityId
            });
        }

        if (!themeCategory.fetching && !themeCategory.data) {
            props.getThemeCategory();
        }
    }
    onCityIdChange (cityId) {
        window.location.href = '/index?cityId=' + cityId;
    }
    onSelectThemeCategory (id) {
        if (id !== this.state.themeCategoryId) {
            this.props.getThemeList({
                cityId: this.props.city.data.id,
                themeCatalog: id
            });
            this.setState({
                themeCategoryId: id
            });
        }
    }
    onSelectTheme (id) {
        this.context.router.push({
            pathname: '/checkout',
            query: {
                'themeId': id
            }
        });
    }
    onSelectPlaceDistrict (id) {
        if (id !== this.state.placeDistrictId) {
            this.props.getPlaceList({
                cityId: this.props.city.data.id,
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
                cityId: this.props.city.data.id,
                placeType: id,
                districtId: this.props.placeList.meta.districtId
            });

            this.setState({
                placeCategoryId: id
            });
        }
    }
    loadMorePlace () {
        var places = this.props.placeList;
        this.props.getPlaceList(_.extend({}, places.meta, {
            page: (places.meta.page || 0) + 1
        }));
    }
    loadMoreCombo () {
        var combos = this.props.comboList;
        this.props.getComboList(_.extend({}, combos.meta, {
            page: (combos.meta.page || 0) + 1
        }));
    }
    loadMoreTheme () {
        var themes = this.props.themeList;
        this.props.getThemeList(_.extend({}, themes.meta, {
            page: (themes.meta.page || 0) + 1
        }));
    }
    render () {
        var cityId;
        var tabContent;
        var props = this.props;
        var error = props.themeList.error ||
                    props.banner.error ||
                    props.comboList.error ||
                    props.placeList.error ||
                    props.themeCategory.error;

        var fetching = props.city.updating ||
                       props.banner.fetching;

        if (error) {
            return <Loading message={ error.message } disableAnimate={ true }/>;
        }

        if (fetching || !this.state.mounted) {
            return (<Loading />);
        }

        if (this.state.tab === 0) {
            tabContent = <ComboList
                combos={ props.comboList }
                loadMore={ this.loadMoreCombo.bind(this) }
            />;
        } else if (this.state.tab === 1){
            tabContent = <ThemeList
                themes={ props.themeList }
                categorys = { props.themeCategory }
                onSelectCategory= { (themeCategoryId) => this.onSelectThemeCategory(themeCategoryId) }
                onSelectTheme={ this.onSelectTheme.bind(this) }
                loadMore={ this.loadMoreTheme.bind(this) }
            />;
        } else {
            tabContent = <PlaceList
                placeList={ props.placeList }
                cityId={ props.city.data.id }
                onSelectDistrict={ this.onSelectPlaceDistrict.bind(this) }
                onSelectCategory={ this.onSelectPlaceCategory.bind(this) }
                loadMore={ this.loadMorePlace.bind(this) }
            />;
        }

        cityId = this.props.city.data.id;

        return (
            <div className="page page-index row flex vertical">
                <Banner banners={ this.props.banner.data }/>
                <CitySelector cityId={ cityId } onCityIdChange={ (cityId) => this.onCityIdChange(cityId) }/>
                <Recommend cityId={ cityId } />
                <div className="title"></div>
                <Tab tabs={ TABS } onChange={ (tab) => this.setState({ tab: tab })  } selected={ this.state.tab }/>
                { tabContent }
                <TabBar />
            </div>
        );
    }
}

IndexPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getCityInfo,
        setCityInfo,
        getBanner,
        getThemeCategory,
        getThemeList,
        getComboList,
        getPlaceList,
        clearOrderForm,
        updateOrderForm
    }, dispatch)
)(IndexPage);
