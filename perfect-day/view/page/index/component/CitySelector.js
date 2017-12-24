import React from 'react';
import CITY_DATA from '../../../data/city.json';
import _ from 'underscore';

var style = {
    wrapper: {
        backgroundColor: 'rgba(0,0,0,.5)',
        borderRadius: '0.75rem',
        display: 'inline-block',
        fontSize: '0.7rem',
        padding: '0 0.5rem',
        lineHeight: '1.5rem',
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        color: '#fff'
    },
    triangle: {
        width: '0px',
        height: '0px',
        borderStyle: 'solid',
        borderWidth: '0.2rem 0.2rem 0 0.2rem',
        borderColor: '#fff transparent transparent transparent',
        marginLeft: '0.2rem',
        verticalAlign: 'middle',
        display: 'inline-block',
        transition: '300ms'
    },
    triangleActive: {
        transform: 'rotate(180deg)',
        WebkitTransform: 'rotate(180deg)'
    },
    selected: {
        display: 'block'
    },
    option: {
        display: 'block'
    }
};

class CitySelector extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            cityId: props.cityId,
            cityName: CITY_DATA[props.cityId].name,
            active: false
        };
    }
    onClick () {
        this.setState({
            active: !this.state.active
        });
    }
    onSelect (cityId) {
        this.setState({
            cityId: cityId,
            cityName: CITY_DATA[cityId].name
        });
        this.props.onCityIdChange(cityId);
    }
    render () {
        return (
            <div style={ style.wrapper } onClick={ this.onClick.bind(this) }>
                <span style={ style.selected }>
                    { this.state.cityName }
                    <i style={ this.state.active ? _.extend({}, style.triangle, style.triangleActive) : style.triangle } />
                </span>
                { (() => {
                    if (this.state.active) {
                        return Object.keys(CITY_DATA).map((id, i) => {
                            if (id != this.state.cityId) {
                                return (<span key={ i } style={ style.option } onClick={ this.onSelect.bind(this, id) }>{ CITY_DATA[id].name }</span>);
                            } else {
                                return null;
                            }
                        });
                    }
                })()}
            </div>
        );
    }
}

export default CitySelector;