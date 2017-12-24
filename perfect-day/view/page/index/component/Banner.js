import React from 'react';
import _ from 'underscore';
import Swiper from '../../../component/Swiper';
import Image from '../../../component/ResponsiveImage';

class Banner extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            index: 0
        };
    }
    onScroll (index) {
        this.setState({
            index: index
        });
    }
    render () {
        var dots = [];
        var banners = this.props.banners || [];
        var count = banners.length;
        for (var i = 0; i < count; i++) {
            dots.push(<i key={ i } style={ _.extend({}, styles.dot, this.state.index === i ? styles.dotActive : null) }/>);
        }

        return (
            <div className="banner">
                <Swiper style={ styles.swiper }
                    callback={ this.onScroll.bind(this) }
                    auto={ 3000 }
                    continuous={ true }
                >
                    {
                        banners.map((item, i) => {
                            return (
                                <a key={i} href={ item.url }>
                                    <Image
                                        lazyload={ false }
                                        ratio={ 0.53125 }
                                        src={ item.imgUrl }
                                    />
                                </a>
                            );
                        })
                    }
                </Swiper>
                <div style={ styles.dots }>
                    {dots}
                </div>
            </div>
        );
    }
}

const styles = {
    dots: {
        position: 'absolute',
        bottom: '0px',
        width: '100%',
        textAlign: 'center'
    },
    dot: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        background: 'rgba(255,255,255,.5)',
        borderRadius: '10px',
        margin: '3px'
    },
    dotActive: {
        background: '#f467aa'
    },
    swiper: {
        width: '16rem',
        height: '8.5rem'
    }
};

export default Banner;