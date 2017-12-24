import React from 'react';

class ScrollView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        this._pos = {
            x: 0,
            y: 0
        };
    }
    onTouchStart (e) {
        this.start = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
            timestamp: Date.now()
        };
    }
    componentWillReceiveProps () {
        translateY(this.refs.scroll, 0, '300ms');
        this._pos.y = 0;
    }
    onTouchEnd (e) {
        var duration = Date.now() - this.start.timestamp;
        var distance = e.changedTouches[0].pageY - this.start.y;
        var scrollHeight = this.refs.scroll.clientHeight;
        var clientHeight = this.refs.root.clientHeight;
        var currentPosY = this._pos.y + distance;

        if (currentPosY > 0 || currentPosY < clientHeight - scrollHeight) {
            this.tailScroll();
            return;
        }
        if (duration < 280) {
            var newMove = momentum(distance, this._pos.y, duration, clientHeight - scrollHeight);
            translateY(this.refs.scroll, newMove.destination, newMove.duration + 'ms');
            this._animating = true;
            this._pos.y = newMove.destination;
        } else {
            this._pos.y = currentPosY;
        }
    }
    onTouchMove (e) {
        var scrollHeight = this.refs.scroll.clientHeight;
        var clientHeight = this.refs.root.clientHeight;
        this.delta = {
            x: e.touches[0].pageX - this.start.x,
            y: e.touches[0].pageY - this.start.y
        };

        if (this._pos.y + this.delta.y > 0 ||
            this._pos.y + this.delta.y < clientHeight - scrollHeight
        ) {
            this.delta.y *= 0.4;
        }

        translateY(this.refs.scroll, this._pos.y + this.delta.y, '0s');
        e.preventDefault();
    }
    onTransitionEnd(e) {
        if (!this._animating || e.target !== this.refs.scroll) {
            return;
        }
        this._animating = false;
        this.tailScroll();
    }
    tailScroll() {
        var scrollHeight = this.refs.scroll.clientHeight;
        var clientHeight = this.refs.root.clientHeight;
        var currentPosY = this._pos.y + (this.delta ? this.delta.y : 0);

        if (currentPosY < clientHeight - scrollHeight) {
            translateY(this.refs.scroll, clientHeight - scrollHeight, '300ms');
            this._pos.y = clientHeight - scrollHeight;
        } else if (currentPosY > 0) {
            translateY(this.refs.scroll, 0, '300ms');
            this._pos.y = 0;
        }
    }
    render () {
        return (
            <div
                ref="root"
                style={ this.props.style }
                className={ this.props.className }
                onTouchStart={ this.onTouchStart.bind(this) }
                onTouchEnd={ this.onTouchEnd.bind(this) }
                onTouchMove={ this.onTouchMove.bind(this) }
                onTransitionEnd={ this.onTransitionEnd.bind(this) }
            >
                <div ref="scroll">{this.props.children}</div>
            </div>
        );
    }
}

function translateY (el, y, duration) {
    el.style.transform = el.style.WebkitTransform = `translate(0, ${y}px) scaleZ(1)`;
    el.style.transitionDuration = el.style.WebkitTransitionDuration = duration;
}

function momentum (distance, curY, time, maxScrollY, warpperHeight) {
    var speed = Math.abs(distance) / time,
        destination, duration;

    var deceleration = 8e-4;

    destination = curY + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
    duration = speed / deceleration;
    if (destination < maxScrollY) {
        destination = warpperHeight ? maxScrollY - warpperHeight / 2.5 * (speed / 8) : maxScrollY;
        distance = Math.abs(destination - curY);
        duration = distance / speed;
    } else if (destination > 0) {
        destination = warpperHeight ? warpperHeight / 2.5 * (speed / 8) : 0;
        distance = Math.abs(curY) + destination;
        duration = distance / speed;
    }
    return {
        destination: Math.round(destination),
        duration: duration
    };
}

export default ScrollView;