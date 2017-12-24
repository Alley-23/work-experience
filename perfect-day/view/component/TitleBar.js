import React from 'react';
import { History } from 'react-router';

const TitleBar = React.createClass({
    mixins: [ History ],
    render () {
        return (
            <header className="titlebar">
                <div className="row box middle">
                    <div className="col-2">
                        <a href="javascript: void(0);">
                            <i className="fi fi-angle-left" />
                        </a>
                    </div>
                    <div className="col-8">
                        <h1 className="title">{ this.props.title || '详情页' }</h1>
                    </div>
                </div>
            </header>
        );
    }
});

export default TitleBar;