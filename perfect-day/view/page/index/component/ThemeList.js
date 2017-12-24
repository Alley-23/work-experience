import React from 'react';
import Image from '../../../component/ResponsiveImage';

class ThemeList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            categoryId: undefined,
            loadingMore: false
        };

        this.onScroll = () => {
            var body = document.body;
            var themes = this.props.themes;

            if (this.state.loadingMore || !themes.data.length || !themes.meta) {
                return;
            }

            if (themes.data.length >= themes.meta.total) {
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

    onSelectCategory (id) {
        this.props.onSelectCategory(id);
        this.setState({
            categoryId: id
        });
    }
    renderList (themes) {
        if (!themes.data || !themes.data.length) {
            return <span className="status-text">没有找到相关主题...</span>;
        }

        return themes.data.map((item, i) => {
            return (
                <div className="theme-item"
                    key={i}
                    onClick={
                        ()=> this.props.onSelectTheme(item.id)
                    }
                >
                    <Image lazyload={true}
                        src={ item.listImgUrl }
                        ratio={ 0.56667 }
                    />
                    <h2 className="theme-item-title">{ item.title }</h2>
                    <p className="theme-item-desc">{ item.description }</p>
                </div>
            );
        });
    }

    render () {
        var cates = [{name: '全部'}];

        if (this.props.categorys.data) {
            cates = cates.concat(this.props.categorys.data);
        }

        return (
            <div className="theme-list">
                <div className="theme-filter">
                    {
                        cates.map((cate, i) => {
                            var className = 'theme-filter-option';
                            if (this.state.categoryId === cate.id) {
                                className += ' active';
                            }

                            return (
                                <span
                                    key={i}
                                    onClick={ () => this.onSelectCategory(cate.id) }
                                    className={ className }
                                >{ cate.name }</span>
                            );
                        })
                    }
                </div>
                { this.renderList(this.props.themes) }
                {
                    (() => {
                        var themes = this.props.themes;

                        if (!themes.data.length || !themes.meta) {
                            return;
                        }
                        if (themes.data.length >= themes.meta.total) {
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

export default ThemeList;