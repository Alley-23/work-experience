import React from 'react';

export default React.createClass({
    getInitialState () {
        return {
            msg: ''
        };
    },
    hideLater () {
        setTimeout(() => {
            this.setState({
                msg: ''
            });
        }, 2000);
    },
    show (msg) {
        this.setState({
            msg: msg
        });
        this.hideLater();
    },
    render () {
        return (
            <div className={`toast${ this.state.msg ? ' active' : ''}`}>
                <span>{ this.state.msg }</span>
            </div>
        );
    }
});