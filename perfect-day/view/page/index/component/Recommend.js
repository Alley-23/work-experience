import React from 'react';
import { Link } from 'react-router';

class Recommend extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        // 999套餐Id，南京为4，北京为31
        var comboId = this.props.cityId == 1 ? 31 : 4;
        var price = this.props.cityId == 1 ? 999 : 799;
        return (
            <div className="row recommend-section">
                <Link className="col-6 recommend-item" to={`/combo/${comboId}?from=nav`}>
                    <i className="sprite-cake" />
                    <div className="recommend-item-info">
                        <em>特价优惠</em>
                        <span>{ price }游乐场趴</span>
                    </div>
                </Link>
                <Link className="col-6 recommend-item"
                    to="/case"
                >
                    <i className="sprite-hat" />
                    <div className="recommend-item-info">
                        <em>派对集锦</em>
                        <span>过往精彩看这</span>
                    </div>
                </Link>
            </div>
        );
    }
}

export default Recommend;