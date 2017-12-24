import React from 'react';

import Toast from '../component/Toast';
import Loading from '../component/Loading';

import { sendPV } from '../../lib/log';

import IndexPage from '../page/index/IndexPage';
import PlaceDetailPage from '../page/place/DetailPage';
import ComboDetailPage from '../page/combo/DetailPage';
import ThemeListPage from '../page/theme/ListPage';
import AccountIndexPage from '../page/account/IndexPage';
import BindPhonePage from '../page/account/BindPhonePage';
import AlbumDetailPage from '../page/account/AlbumDetailPage';
import AlbumListPage from '../page/account/AlbumListPage';
import AlbumSharePage from '../page/account/AlbumSharePage';
import InvitationListPage from '../page/account/InvitationListPage';
import CouponListPage from '../page/account/CouponListPage';
import CheckoutPage from '../page/order/CheckoutPage';
import ChooseThemePage from '../page/order/ChooseThemePage';
import ChooseCommodityPage from '../page/order/ChooseCommodityPage';
import ChoosePlacePage from '../page/order/ChoosePlacePage';
import ChooseCouponPage from '../page/order/ChooseCouponPage';
import ChooseComboPage from '../page/order/ChooseComboPage';
import OrderDetailPage from '../page/order/OrderDetailPage';
import OrderListPage from '../page/order/OrderListPage';
import CaseListPage from '../page/case/ListPage';
import PaymentPage from '../page/order/PaymentPage';
import PaymentStatusPage from '../page/order/PaymentStatusPage';
import QRCodePage from '../page/account/QRCodePage';

class Container extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            height: document.documentElement.clientHeight
        };

        this.onResize = () => {
            this.setState({
                height: document.documentElement.clientHeight
            });
        };
    }
    componentDidMount () {
        window.addEventListener('resize', this.onResize, false);
    }
    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize, false);
    }
    getChildContext () {
        return {
            toast: {
                show: (msg) => this.refs.toast.show(msg)
            }
        };
    }
    render () {
        return (
            <div className="pages" style={{ height: this.state.height }}>
                <Toast ref="toast" />
                { this.props.children }
            </div>
        );
    }
}

Container.childContextTypes = {
    toast: React.PropTypes.object
};

class PageNotFound extends React.Component {
    render () {
        return (
            <Loading message="页面未找到..." disableAnimate={ true }/>
        );
    }
}

const rootRoute = {
    path: '/',
    component: Container,
    onChange: function () {
        sendPV();
    },
    onEnter: function () {
        sendPV();
    },
    indexRoute: {
        component: IndexPage
    },
    childRoutes: [
        {
            path: 'index',
            component: IndexPage
        },
        {
            path: 'theme',
            component: ThemeListPage
        },
        {
            path: 'case',
            component: CaseListPage
        },
        {
            path: 'place/:id',
            component: PlaceDetailPage
        },
        {
            path: 'combo/:id',
            component: ComboDetailPage
        },
        {
            path: 'account',
            component: AccountIndexPage
        },
        {
            path: 'account/bind_phone',
            component: BindPhonePage
        },
        {
            path: 'account/coupon',
            component: CouponListPage
        },
        {
            path: 'account/qrcode',
            component: QRCodePage
        },
        {
            path: 'account/invitation',
            component: InvitationListPage
        },
        {
            path: 'account/album',
            component: AlbumListPage
        },
        {
            path: 'account/album/:id',
            component: AlbumDetailPage
        },
        {
            path: 'account/album/share/:id',
            component: AlbumSharePage
        },
        {
            path: 'checkout',
            component: CheckoutPage
        },
        {
            path: 'checkout/commodity',
            component: ChooseCommodityPage
        },
        {
            path: 'checkout/place',
            component: ChoosePlacePage
        },
        {
            path: 'checkout/combo',
            component: ChooseComboPage
        },
        {
            path: 'checkout/theme',
            component: ChooseThemePage
        },
        {
            path: 'order',
            component: OrderListPage
        },
        {
            path: 'order/:code',
            component: OrderDetailPage
        },
        {
            path: 'order/:code/coupon',
            component: ChooseCouponPage
        },
        {
            path: 'payment',
            component: PaymentPage
        },
        {
            path: 'payment/:code',
            component: PaymentStatusPage
        },
        {
            path: '*',
            component: PageNotFound
        }
    ]
};

export default rootRoute;
