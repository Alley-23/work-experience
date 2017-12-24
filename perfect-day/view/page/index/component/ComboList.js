import React from 'react';
import { Link } from 'react-router';

import Image from '../../../component/ResponsiveImage';

class ComboList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loadingMore: false
        };

        this.onScroll = () => {
            var body = document.body;
            var combos = this.props.combos;

            if (this.state.loadingMore || !combos.data.length || !combos.meta) {
                return;
            }

            if (combos.data.length >= combos.meta.total) {
                return;
            }

            if (body.scrollTop + body.clientHeight + 30 >= body.scrollHeight) {
                this.props.loadMore();
                this.setState({
                    loadingMore: true
                });
            }
        };
    }
    componentDidMount () {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    componentWillReceiveProps() {
        this.setState({
            loadingMore: false
        });
    }

    render () {
        return (
            <div className="theme-list">
            {
                (this.props.combos.data || []).map((combo, i) => {
                    return (
                        <Link key={i} className="theme-item"
                            to={{ pathname: `/combo/${combo.id}`}}
                        >
                            <Image lazyload={ true }
                                ratio={ 0.53125 }
                                src={ combo.listImgUrl }
                            />
                            <h2 className="theme-item-title">[{ combo.showPrice }元]{ combo.longName }</h2>
                            <p className="theme-item-desc">{ combo.description }</p>
                        </Link>
                    );
                })
            }
            {
                (() => {
                    var combos = this.props.combos;

                    if (!combos.data.length || !combos.meta) {
                        return;
                    }
                    if (combos.data.length >= combos.meta.total) {
                        return <span className="status-text">加载完成</span>;
                    } else {
                        return <span className="status-text">加载中...</span>;
                    }
                })()
            }
            </div>
        );
    }
}

export default ComboList;