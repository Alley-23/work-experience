import React from 'react';

export default React.createClass({
    render () {
        return (
            <div className="page page-loading">
                <div className={`loading${ this.props.disableAnimate ? '' : ' animate' }`}>
                    <i className="spinner"/>
                    <span>{ this.props.message || '努力加载中...'}</span>
                </div>
            </div>
        );
    }
});