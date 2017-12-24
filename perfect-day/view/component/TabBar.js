import React from 'react';
import { Link } from 'react-router';

class TabBar extends React.Component {
    render () {
        return (
            <div className="tabbar">
                <div className="tabbar-wrapper row">
                    <div className="tabbar-item col-4">
                        <Link to="/index" activeClassName="active">
                            <i className="sprite-nav-home" />
                        </Link>
                    </div>
                    <div className="tabbar-item col-4">
                        <Link to="/order" activeClassName="active">
                            <i className="sprite-nav-order" />
                        </Link>
                    </div>
                    <div className="tabbar-item col-4">
                        <Link to="/account" activeClassName="active">
                            <i className="sprite-nav-profile" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default TabBar;