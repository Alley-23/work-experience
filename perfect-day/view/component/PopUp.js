import objectAssign from 'object-assign';
import React from 'react';

const style = {
    wrapper: {
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,.3)',
        zIndex: '1000'
    },
    show: {
        display: 'block'
    },
    content: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        background: '#fff'
    }
};

class PopUp extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            show: false
        };
    }
    onMaskClick (e) {
        if (e.target === this.refs.root) {
            this.setState({
                show: false
            });
        }
    }
    show () {
        this.setState({
            show: true
        });
    }
    hide () {
        this.setState({
            show: false
        });
    }
    render () {
        return (
            <div ref="root"
                style={ objectAssign({}, style.wrapper, this.state.show ? style.show : undefined ) }
                onClick={ this.onMaskClick.bind(this) }
                onTouchMove= {
                    (e) => e.preventDefault()
                }
            >
                <div className="animate animate-slide-in-up" style={ style.content }>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default PopUp;