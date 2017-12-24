import React from 'react';

const OPTION_HEIGHT = 40;

function momentum (distance, pos, time, max, viewport) {
    var speed = Math.abs(distance) / time,
        destination, duration;

    var deceleration = 8e-4;

    destination = pos + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
    duration = speed / deceleration;

    if (destination < max) {
        destination = viewport ? max - viewport / 2.5 * (speed / 8) : max;
        distance = Math.abs(destination - pos);
        duration = distance / speed;
    } else if (destination > 0) {
        destination = viewport ? viewport / 2.5 * (speed / 8) : 0;
        distance = Math.abs(pos) + destination;
        duration = distance / speed;
    }
    return {
        destination: Math.round(destination),
        duration: duration
    };
}

class ScrollWheelPicker extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            selected: props.selected || 0,
            upLimit: 2 * OPTION_HEIGHT,
            downLimit: (2 - (props.options.length - 1)) * OPTION_HEIGHT
        };
    }

    componentDidMount () {
        this.scrollTo(this.state.selected);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.selected !== this.state.selected) {
            this.scrollTo(nextProps.selected, '300ms');
            this.setState({
                downLimit: (2 - (nextProps.options.length - 1)) * OPTION_HEIGHT
            });
        }
    }

    getValue () {
        return this.props.options[this.state.selected];
    }

    transform (pos, duration) {
        this.position = pos;
        this.refs.wrapper.style.transform = this.refs.wrapper.style.webkitTransform = `translate3d(0,${pos}px, 0)`;
        this.refs.wrapper.style.transition = this.refs.wrapper.style.webkitTransition = duration || '0s';
    }

    scrollTo (i, duration, triggerEvent) {
        if (i < 0) {
            i = 0;
        }

        if (i >= this.props.options.length) {
            i = this.props.options.length - 1;
        }

        this.transform((2 - i) * OPTION_HEIGHT, duration);

        if (triggerEvent && this.state.selected !== i && this.props.onSelect) {
            this.props.onSelect(i);
        }

        this.setState({
            selected: i
        });
    }

    onTouchStart (e) {
        this.touchStartAt = e.touches[0].clientY;
        this.touchStartTimestamp = Date.now();
    }
    onTouchMove (e) {
        var dest;
        var start = (2 - this.state.selected) * OPTION_HEIGHT;
        if (this.touchStartAt == null || e.isDefaultPrevented()) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.touchMoveDistance = e.touches[0].clientY - this.touchStartAt;
        dest = start + this.touchMoveDistance;

        if (dest > this.state.upLimit) {
            dest = 0.4 * dest + 0.6 * this.state.upLimit;
        } else if (dest < this.state.downLimit) {
            dest = 0.4 * dest + 0.6 * this.state.downLimit;
        }

        this.transform(dest);
    }
    onTouchEnd (e) {
        var end = e.changedTouches[0].clientY;
        var start = this.touchStartAt;
        var duration = Date.now() - this.touchStartTimestamp;
        var inertia;
        if (duration > 500) {
            this.scrollTo(2 - Math.round((this.position) / OPTION_HEIGHT), '300ms', true);
        } else {
            inertia = momentum (end - start, this.position - 2 * OPTION_HEIGHT, duration, this.downLimit - this.upLimit);
            this.scrollTo( -1 * Math.round(inertia.destination/OPTION_HEIGHT), inertia.duration + 'ms', true);
        }

        this.touchMoveDistance = null;
        this.touchStartAt = null;
    }

    render () {
        return (
            <div className="scroll-wheel-picker">
                <div className="scroll-wheel-picker-options"
                    onTouchStart={ this.onTouchStart.bind(this) }
                    onTouchMove={ this.onTouchMove.bind(this) }
                    onTouchEnd={ this.onTouchEnd.bind(this) }
                >
                    <div className="scroll-wheel-picker-options-wrapper" ref="wrapper">
                        {
                            this.props.options.map((x, i) => {
                                return <span className="scroll-wheel-picker-option" key={i}>{x}</span>;
                            })
                        }
                    </div>
                </div>
                <span className="scroll-wheel-picker-label">{ this.props.label }</span>
            </div>
        );
    }
}

export default ScrollWheelPicker;