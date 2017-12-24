import React from 'react';
import { resizeQiniuURL } from '../util';
import IMAGE_BACKGROUND from '../../static/image/placeholder.png';
import _ from 'underscore';

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const style = {
    wrapper: {
        width: '100%',
        position: 'relative',
        display: 'block',
        backgroundColor: '#EAEDF3',
        backgroundImage: 'url("' + IMAGE_BACKGROUND + '")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '50% auto'
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0px',
        top: '0px'
    }
};

class ResponsiveImage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            src: BLANK_IMAGE,
            width: 0,
            height: 0
        };

        this.onScroll = () => {
            setTimeout(() => {
                this.check();
            });
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src) {
            this.setState({
                src: BLANK_IMAGE,
                width: 0,
                height: 0
            });

            if (nextProps.lazyload) {
                window.removeEventListener('scroll', this.onScroll, false);
                window.addEventListener('scroll', this.onScroll, false);
                setTimeout(() => {
                    this.check();
                });
            } else {
                this.loadImage();
            }
        }
    }
    getResizedQiniuImageUrl () {
        var rect = this.refs.img.getBoundingClientRect();
        var ratio = this.getRatio();
        var src = resizeQiniuURL({
            url: this.props.src,
            width: rect.width * 2,
            height: ratio * rect.width * 2,
            cut: this.props.cut
        });

        return src;
    }
    loadImage () {
        let img = new Image();
        let src = this.props.src;

        if (src.indexOf('qiniucdn.com') !== -1) {
            src = this.getResizedQiniuImageUrl();
        }

        this.request = img;
        img.onload = () => {
            img.onload = null;
            this.setState({
                src: src,
                height: img.height,
                width: img.width
            });
        };
        img.src = src;
    }
    check () {
        var el = this.refs.img;
        var rect = el.getBoundingClientRect();

        if (rect.top > document.documentElement.clientHeight * 2) {
            return;
        }

        window.removeEventListener('scroll', this.onScroll, false);
        this.loadImage();
    }
    componentDidMount () {
        if (this.props.lazyload) {
            window.addEventListener('scroll', this.onScroll, false);
            this.check();
        } else {
            this.loadImage();
        }
    }
    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, false);
        if (this.request) {
            this.request.onload = null;
        }
    }
    getRatio () {
        var ratio = this.props.ratio;

        if (!ratio) {
            if (this.state.width && this.state.height) {
                ratio = this.state.height / this.state.width;
            } else {
                ratio = 1;
            }
        }

        return ratio;
    }
    render() {
        return (
            <div style={ _.extend({}, style.wrapper, {paddingTop: (this.getRatio() * 100) + '%' })}>
                <img style={ style.image } src={ this.state.src } alt={this.props.alt || ''} ref='img' />
            </div>
        );
    }
}

ResponsiveImage.propTypes = {
    src: React.PropTypes.string.isRequired,
    ratio: React.PropTypes.number,
    lazyload: React.PropTypes.bool
};

ResponsiveImage.defaultProps = {
    ratio: 0,
    lazyload: false
};

export default ResponsiveImage;