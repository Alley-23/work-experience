import React from 'react';
import _ from 'underscore';
import ReactSwipe from 'react-swipe';

class Swipe extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            index: 0
        };
    }
    onScroll (index) {
        this.setState({
            index: index
        });
    }
    render () {
        var dots = [];
        var count = React.Children.count(this.props.children);
        for (var i = 0; i < count; i++) {
            dots.push(<i key={ i } style={ _.extend({}, styles.dot, this.state.index === i ? styles.dotActive : null) }/>);
        }

        return (
            <div>
                <ReactSwipe key={ 3 } swipeOptions={{
                    callback: this.onScroll.bind(this),
                    auto: 3000
                }}>
                    { this.props.children }
                </ReactSwipe>

                <div style={ styles.dots }>
                    {dots}
                </div>
            </div>
        );
    }
}

const styles = {
    dots: {
        position: 'absolute',
        bottom: '0px',
        width: '100%',
        textAlign: 'center'
    },
    dot: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        background: 'rgba(255,255,255, .5)',
        borderRadius: '10px',
        margin: '3px'
    },
    dotActive: {
        background: '#f467aa'
    }
};

export default Swipe;