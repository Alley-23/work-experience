import React from 'react';

const styles = {
    container: {
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%'
    }
};

class Swiper extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            index: 0
        };
        this._index = 0;
        this._slide = {};
    }
    shouldComponentUpdate() {
        return false;
    }
    onTouchStart (e) {
        this.startAt = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
            timestamp: Date.now()
        };
    }
    onTouchMove (e) {
        this.delta = {
            x: e.touches[0].pageX - this.startAt.x,
            y: e.touches[0].pageY - this.startAt.y
        };

        transform(this.getCurr(), this.delta.x, '0s');

        if (React.Children.count(this.props.children) !== 1) {
            if (this.delta.x < 0) {
                transform(this.getNext(), this.getWidth() + this.delta.x, '0s');
            } else {
                transform(this.getPrev(), this.delta.x - this.getWidth(), '0s');
            }
        }
    }
    onTouchEnd () {
        var duration = Date.now() - this.startAt.timestamp;
        var width = this.getWidth();
        var isValidSlide = this.delta &&
            (duration < 250 &&
            Math.abs(this.delta.x) > 20 ||
            Math.abs(this.delta.x) > width / 3);

        if (!isValidSlide) {
            this.slideTo(this._index);
            return;
        }

        if (this.delta.x < 0) {
            this.slideTo(this._index + 1);
        } else if (this.props.continuous){
            this.slideTo(this._index - 1);
        } else {
            this.slideTo(this._index);
        }

        this.delta = null;
    }
    slideTo (index) {
        var total = React.Children.count(this.props.children);
        var width = this.getWidth();
        var duration = '300ms';

        if (!this.delta) {
            return;
        } else if (total === 1) {
            transform(this.getCurr(), 0, duration);
        } else if (index === this._index) {
            transform(this.getCurr(), 0, duration);
            if (this.delta.x > 0) {
                transform(this.getPrev(), -1 * width, duration);
            } else {
                transform(this.getNext(), width, duration);
            }
        } else {
            if (index > this._index) {
                transform(this.getCurr(), -1 * width, duration);
            } else {
                transform(this.getCurr(), width, duration);
            }

            if (index >= total) {
                index = 0;
            } else if (index < 0) {
                index = total + index;
            }
            transform(this._slide[index], 0, duration);
        }

        if (total !== 1) {
            this._index = index;
        }
        if (this.props.callback) {
            this.props.callback(this._index);
        }
    }
    getWidth() {
        return this.props.width || document.documentElement.clientWidth;
    }
    getNext() {
        var next = this._index + 1;

        if (next >= Object.keys(this._slide).length) {
            return this._slide[0];
        } else {
            return this._slide[next];
        }
    }
    getPrev() {
        var prev = this._index - 1;

        if (prev < 0) {
            return this._slide[Object.keys(this._slide).length - 1];
        } else {
            return this._slide[prev];
        }
    }
    getCurr() {
        return this._slide[this._index];
    }
    render () {
        var children = React.Children.toArray(this.props.children);
        var width = this.getWidth();

        var isCurr = (i) => i === this._index;
        var isPrev = (i) => i === this._index - 1 ||
            this._index === 0 &&
            i === children.length - 1;

        children = children.map((child, i) => {
            var transform, translate;
            if (isCurr(i)) {
                translate = 0;
            } else if (isPrev(i)) {
                translate = -1 * width;
            } else {
                translate = width;
            }

            transform = `translate(${ translate }px, 0) scaleZ(1)`;
            return (
                <div key={ i }
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.getWidth(),
                        transform: transform,
                        WebkitTransform: transform
                    }}
                    ref={
                        (c) => {
                            this._slide[i] = c;
                    }
                } >
                    { child }
                </div>
            );
        });

        return (
            <div
                style={ this.props.style }
                onTouchMove={ this.onTouchMove.bind(this) }
                onTouchEnd={ this.onTouchEnd.bind(this) }
                onTouchStart={ this.onTouchStart.bind(this) }
            >
                <div style={ styles.container }>
                    { children }
                </div>
            </div>
        );
    }
}

function transform (el, x, duration) {
    el.style.transform = el.style.WebkitTransform = `translate(${x}px, 0) scaleZ(1)`;
    el.style.transitionDuration = el.style.WebkitTransitionDuration = duration;
}

export default Swiper;