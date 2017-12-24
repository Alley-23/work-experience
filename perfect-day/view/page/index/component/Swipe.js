import React from 'react';
import _ from 'underscore';
import ReactSwipe from 'react-swipe';

import Image from '../../../component/ResponsiveImage';

class Swipe extends React.Component {
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
        return (
            <div>
                <ReactSwipe key={ 3 } swipeOptions={{
                    callback: this.onScroll.bind(this),
                    auto: 3000
                }}>
                    <a href={`http://m.party.wanmei.cn/static/misc/kids_party/html/themelist.html`}>
                        <Image
                            ratio={ 0.53125 }
                            src="http://s1.wm1t.com/static/party/image/banner_invitation.jpg"
                        />
                    </a>
                    <a href={`http://m.party.wanmei.cn/static/misc/kids_party/html/themelist.html`}>
                        <Image
                            ratio={ 0.53125 }
                            src="http://s1.wm1t.com/static/party/image/banner_invitation.jpg"
                        />
                    </a>
                    <a href={`http://m.party.wanmei.cn/static/misc/kids_party/html/themelist.html`}>
                        <Image
                            ratio={ 0.53125 }
                            src="http://s1.wm1t.com/static/party/image/banner_invitation.jpg"
                        />
                    </a>
                </ReactSwipe>
                <div style={ styles.dots }>
                    <i style={ _.extend({}, styles.dot, this.state.index === 0 ? styles.dotActive : null) }/>
                    <i style={ _.extend({}, styles.dot, this.state.index === 1 ? styles.dotActive : null) }/>
                    <i style={ _.extend({}, styles.dot, this.state.index === 2 ? styles.dotActive : null) }/>
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
        background: 'white',
        borderRadius: '10px',
        margin: '3px'
    },
    dotActive: {
        background: 'black'
    }
};

export default Swipe;