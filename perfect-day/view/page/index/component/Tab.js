import React from 'react';
import _ from 'underscore';

const styles = {
    tabs: {
        height: '45px',
        backgroundColor: '#fff',
        position: 'relative',
        zIndex: 1002
    },
    tabItem: {
        float: 'left',
        textAlign: 'center',
        fontSize: '17px',
        lineHeight: '45px',
        color: '#999',
        boxSizing: 'border-box',
        height: '45px',
        borderBottom: '2px solid #fff'
    },
    activeTabItem: {
        color: '#f467aa',
        borderBottom: '2px solid #f467aa'
    }
};

class Tab extends React.Component {
    constructor (props) {
        super(props);
        this.state = {tab: this.props.selected};
    }
    render () {
        var tabItemStyle = _.extend(
            {},
            styles.tabItem,
            { width: 1/this.props.tabs.length * 100 + '%'}
        );

        return (
            <div style={ styles.tabs }>
                {
                    this.props.tabs.map((tab, i) => {
                        var style = tabItemStyle;
                        if (this.state.tab === i) {
                            style = _.extend({}, tabItemStyle, styles.activeTabItem);
                        }

                        return (
                            <div style={ style }
                                key={ i }
                                onClick={
                                    () => {
                                        this.setState({tab: i});
                                        this.props.onChange(i);
                                    }
                                }
                            >
                                { tab }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default Tab;