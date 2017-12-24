import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import { getThemeList } from '../../action/theme';
import ResponsiveImage from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import * as Util from '../../util';
import { style } from '../index/IndexPage';

class ThemeListPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidMount () {
        var cityId = Util.getCityId(this.props.location.query);

        if (!this.props.themeList.data ||
            !this.props.themeList.meta ||
            this.props.themeList.meta.cityId !== cityId
        ) {
            this.props.getThemeList({
                cityId
            });
        }
    }

    render () {
        var error = this.props.themeList.error;

        if (error) {
            return <Loading message={ error.message } disableAnimate={ true }/>;
        }

        if (this.props.themeList.fetching || !this.props.themeList.data) {
            return <Loading />;
        }

        return (
            <div className="page page-theme-list">
                {
                    (this.props.themeList.data || []).map((item, i) => {
                        return (
                            <Link to={{ pathname: `/theme/${ item.id }`, query: {cityId: this.state.cityId} }} style={ style.themeItem } key={ i }>
                                <ResponsiveImage
                                    ratio={ 0.53125 }
                                    src={ item.listImgUrl }
                                    lazyload={ true }
                                />
                                <h3 style={ style.themeItemTitle } >{ item.title }</h3>
                                <p style={ style.themeItemDescription }>
                                    { item.description }
                                </p>
                            </Link>
                        );
                    })
                }
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({ getThemeList }, dispatch)
)(ThemeListPage);