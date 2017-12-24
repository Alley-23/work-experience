import React from 'react';
import ReactSwipe from 'react-swipe';
import ResponsiveImage from './ResponsiveImage';

class ImageSlider extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            index: 0
        };
    }
    handleSwipe (i) {
        this.setState({
            index: i
        });
    }
    render() {
        var index = this.state.index;
        return (
            <div className="image-slider">
                <ReactSwipe callback={this.handleSwipe.bind(this)} auto={3000} >
                {
                    this.props.images.map((item, i) => {
                        return <div key={i}><ResponsiveImage src={item} lazyload={!!i} /></div>;
                    })
                }
                </ReactSwipe>
                <div className="image-slider-index">
                {
                    this.props.images.map((item, i) => {
                        return <i key={i} className={ i === index ? 'active' : '' }></i>;
                    })
                }
                </div>
            </div>
        );
    }
}

ImageSlider.propTypes = {
    images: React.PropTypes.array.isRequired
};



export default ImageSlider;