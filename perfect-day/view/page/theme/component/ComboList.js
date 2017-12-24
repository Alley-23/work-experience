import React from 'react';

class PricePin extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fixed: false
        };

        this.onScroll = function () {
            this.checkScrollPosition();
        }.bind(this);
    }
    componentDidMount () {
        window.addEventListener('scroll', this.onScroll, false);
        this.checkScrollPosition();
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }
    checkScrollPosition () {
        var isFixed = window.scrollY > document.documentElement.clientWidth * (1 / 16 + 1);
        if (isFixed) {
            this.refs.comboList.className = "combo-list row flex center fixed";
        } else {
            this.refs.comboList.className = "combo-list row flex center";
        }
    }
    render () {
        var combos = this.props.combos;
        var comboId = this.props.comboId;
        var len = combos.length;
        var padding = (16 - 5.25 * len) / 2;
        var index, left, pointerStyle;

        for (var i = 0; i < combos.length; i++) {
            if (combos[i].id === comboId) {
                index = i;
                break;
            }
        }

        left = padding - 0.4 + (index + 0.5) * 5.25;

        pointerStyle = {
            transform: `translate(${left}rem, 0)`,
            WebkitTransform: `translate(${left}rem, 0)`
        };

        return (
            <div className="combo-list-wrapper">
                <div className="combo-list row flex center" ref="comboList">
                    {
                        this.props.combos.map((combo, i) =>{
                            return (
                                <div
                                    onClick={()=>{ this.props.onSelectCombo(combo.id); }}
                                    className={`combo-item${ combo.id === this.props.comboId ? ' active' : '' }`}
                                    key={ i }
                                >
                                    <span className="combo-name">
                                        完美
                                        <em>{ combo.name.replace('完美-', '') }</em>
                                    </span>
                                    <span className="combo-price">
                                        <em>{ combo.showPrice }</em>
                                        {
                                            (() => {
                                                if (combo.orgShowPrice) {
                                                    return <sub>{ combo.orgShowPrice }</sub>;
                                                }
                                            })()
                                        }
                                    </span>
                                </div>
                            );
                        })
                    }
                    <i className="pointer" style={ pointerStyle } />
                </div>
            </div>
        );
    }
}

export default PricePin;