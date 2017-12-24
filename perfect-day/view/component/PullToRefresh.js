import React from 'react';
import ReactDom from 'react-dom';

const PULL_TO_REFRESH_TEXT = '下拉即可刷新...';
const RELEASE_TO_REFRESH_TEXT = '松开即可刷新...';
const REFRESHING_TEXT = '刷新中...';


class ScrollView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            isActive: false,
            text: PULL_TO_REFRESH_TEXT
        };
    }
    transform(dist, duration) {
        this.refs.content.style.transform = this.refs.content.style.webkitTransform = `translate3d(0,${dist}px, 0)`;
        this.refs.content.style.transition = this.refs.content.style.webkitTransition = duration;

        this.refs.head.style.transform = this.refs.head.style.webkitTransform = `translate3d(0, ${-1 * (50 - dist)}px, 0)`;
        this.refs.head.style.transition = this.refs.head.style.webkitTransition = duration;
    }
    componentDidMount () {
        this.transform('0', '0s');
        this.refs.content.style.minHeight = ReactDom.findDOMNode(this).clientHeight + 'px';
    }
    onTouchStart (e) {
        if (this.state.loading) {
            return;
        }
        this.touchStartAt = e.touches[0].clientY;
    }
    onTouchEnd() {
        var self = this;

        if (!this.touchMoveDistance) {
            return;
        }

        if (this.touchMoveDistance > 50) {
            this.transform('50', '300ms');
            this.setState({
                isLoading: true,
                text: REFRESHING_TEXT
            });

            this.props.onRefresh(function () {
                self.transform('0', '300ms');
                self.setState({
                    isLoading: false,
                    isActive: false
                });
            });
        } else {
            this.transform('0', '300ms');
        }
        this.touchMoveDistance = null;
        this.touchStartAt = null;
    }
    onTouchMove (e) {
        if (this.touchStartAt === null) {
            return;
        }

        if (e.isDefaultPrevented()) {
            return;
        }

        if (this.state.isLoading) {
            e.preventDefault();
            return;
        }

        var dist = e.touches[0].clientY - this.touchStartAt;
        var scrollTop = ReactDom.findDOMNode(this).scrollTop;

        if (scrollTop || dist < 0) {
            return;
        }

        e.preventDefault();

        this.touchMoveDistance = dist * 0.3;
        var isActive = this.touchMoveDistance >= 50;
        this.transform(this.touchMoveDistance, '0s');
        this.setState({
            text: isActive ? RELEASE_TO_REFRESH_TEXT : PULL_TO_REFRESH_TEXT,
            isActive: isActive
        });
    }
    render () {
        var className = 'pull-to-refresh';
        var icon = <i className="fa fa-long-arrow-down pull-to-refresh-icon"></i>;

        if (this.state.isLoading) {
            className += ' loading';
            icon = <i className="fa fa-circle-o-notch pull-to-refresh-icon"></i>;
        } else if (this.state.isActive) {
            className += ' active';
        }

        return (
            <div className={ className }>
                <div ref="head" className="pull-to-refresh-head">
                    { icon }
                    <span className="pull-to-refresh-text">{ this.state.text }</span>
                </div>
                <div ref="content" className="pull-to-refresh-content"
                    onTouchMove={ this.onTouchMove.bind(this) }
                    onTouchStart={ this.onTouchStart.bind(this) }
                    onTouchEnd={ this.onTouchEnd.bind(this) }
                >
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default ScrollView;