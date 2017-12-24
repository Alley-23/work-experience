import React from 'react';
import {connect} from 'react-redux';
import Loading from '../../component/Loading';
import {getPhotoListFetch} from '../../action/album';
import { Link } from 'react-router';
import dateFormatter from '../../../lib/date_formatter';

class AlbumListPage extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getPhotoListFetch();
    }

    componentWillReceiveProps(nextProps) {
        var photoList = nextProps.photoList;
        if (photoList.data && photoList.data.length === 1) {
            let item = nextProps.photoList.data[0];
            this.context.router.replace(`/account/album/${item.id}?sign=${item.sign}`);
        }
    }

    render() {
        var photoList = this.props.photoList;
        if (photoList.err) {
            return (<Loading message={`阿哦！${photoList.err}`} disableAnimate={ true }/>);
        }
        if (!photoList.data || photoList.fetching) {
            return (<Loading />);
        }
        if (!photoList.data.length) {
            return (<Loading message="您还没有相册哦，赶紧下单吧！" disableAnimate={ true }/>);
        }

        let list = photoList.data.reduce(function (lis, item, i) {
            let pathname = `/account/album/${item.id}`;
            let query = {sign: item.sign};
            lis.push(
                <Link className="album-item" to= {{ pathname, query }} key={i}>
                    <h2 className="title"><i className="sprite-heart" />{ `${item.kidsName}小朋友生日相册 ${dateFormatter(item.partyTime, 'yyyy-mm-dd')}` }</h2>
                    <h4 className="place">{ item.placeName }</h4>
                    <i className="fi fi-angle-right" />
                </Link>
            );
            return lis;
        }, []);
        return (<div className="page page-album-list">
                    <div className="album-item-list">
                        { list }
                    </div>
                </div>);
    }
}

AlbumListPage.contextTypes = {
     router: React.PropTypes.object.isRequired
};

export default connect(
    (state) => state,
    {getPhotoListFetch}
)(AlbumListPage);
