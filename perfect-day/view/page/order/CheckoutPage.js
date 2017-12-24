import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';

import * as Logger from '../../../lib/log';
import { SERVICE_PHONE } from '../../constant';
import * as BackendAPI from '../../../lib/backend_api';
import dateFormatter from '../../../lib/date_formatter';
import Validator, * as Rules from '../../../lib/validator.js';
import { getPlaceDetail } from '../../action/place';
import { getThemeDetail } from '../../action/theme';
import { getComboDetail } from '../../action/combo';
import { updateOrderForm, getOrderDetail, clearOrderForm } from '../../action/order';
import { getCurrentUser } from '../../action/user';
import { getChildCommodity, getAdultCommodity } from '../../action/commodity';
import ResponsiveImage from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import PopUp from '../../component/PopUp';
import DatePicker from '../../component/DatePicker';
import Picker from '../../component/ScrollWheelPicker';
import Toast from '../../component/Toast';
import * as Util from '../../util';

const CHECKOUT_MODE_CREATE = 'CHECKOUT_MODE_CREATE';
const CHECKOUT_MODE_EDIT = 'CHECKOUT_MODE_EDIT';

const ORDER_FORM = new Validator({
    comboId: Rules.required('请选择套餐'),
    partyTime: Rules.required('请选择派对举办时间'),
    placeId: Rules.required('请选择派对举办地点'),
    contactPhone: [
        Rules.required('请输入您的联系方式'),
        Rules.format('phone', '请输入格式正确的手机号')
    ],
    partyKidsNumber: Rules.required('请选择参加派对的人数'),
    partyParentsNumber: Rules.required('请选择参加派对的人数'),
    kidName: Rules.required('请输入小寿星的姓名'),
    kidBirthday: Rules.required('请输入小寿星的生日')
});

class CheckoutPage extends React.Component {
    constructor (props) {
        var orderCode = props.location.query.orderCode || props.orderForm.orderCode;
        super(props);

        this.state = {
            fetching: true,
            submitting: false,
            error: null,
            orderCode,
            mode: orderCode ? CHECKOUT_MODE_EDIT : CHECKOUT_MODE_CREATE,
            cityId: Util.getCityId(props.location.query)
        };
    }

    componentDidMount () {
        var props = this.props;
        var user = props.user;
        var orderCode = this.state.orderCode;
        var query = props.location.query;

        if (user.data) {
            if (!user.data.phone) {
                this.context.router.replace({
                    pathname: '/account/bind_phone',
                    query: {
                        callback: window.location.href
                    }
                });
                return;
            } else if (query.comboId || query.themeId || query.placeId){
                props.clearOrderForm();
                props.updateOrderForm({
                    comboId: query.comboId,
                    themeId: query.themeId,
                    placeId: query.placeId
                });

                this.context.router.replace({
                    pathname: '/checkout',
                    query: {
                        from: query.comboId ? 'combo' : (query.themeId ? 'theme' : 'place')
                    }
                });
                this.loadData(
                    Util.getCityId(props.location.query),
                    query.themeId,
                    query.placeId,
                    query.comboId
                );
                return;
            }
        } else {
            props.getCurrentUser();
        }

        if (this.state.mode === CHECKOUT_MODE_EDIT &&
            props.orderForm.orderCode !== orderCode
        ) {
            props.getOrderDetail(orderCode);
        } else {
            this.loadData(
                Util.getCityId(props.location.query),
                props.orderForm.themeId,
                props.orderForm.placeId,
                props.orderForm.comboId
            );
            this.checkOrderForm(props);
        }
    }

    componentWillReceiveProps (nextProps) {
        var query = nextProps.location.query;
        var error = nextProps.themeDetail.error ||
                    nextProps.comboDetail.error ||
                    nextProps.placeDetail.error ||
                    nextProps.childCommodity.error ||
                    nextProps.adultCommodity.error;
        var themeDetailFetching = true;
        var comboDetailFetching = true;
        var placeDetailFetching = true;
        var adultCommodityFetching = true;
        var childCommodityFetching = true;
        var orderDetailFetching = true;
        var cityId = this.state.cityId;
        var orderForm = nextProps.orderForm;
        var themeId = orderForm.themeId;
        var comboId = orderForm.comboId;
        var placeId = orderForm.placeId;

        if (error) {
            this.setState({
                error: error
            });
            return;
        }

        if (nextProps.user.error) {
            if (Util.isNeedLoginError(nextProps.user.error)) {
                Util.loginToWeixin();
            } else {
                this.setState({
                    error: nextProps.user.error
                });
            }
            return;
        } else if (nextProps.user.data) {
            if (!nextProps.user.data.phone) {
                this.context.router.replace({
                    pathname: '/account/bind_phone',
                    query: {
                        callback: window.location.href
                    }
                });
                return;
            }

            if (query.comboId || query.themeId || query.placeId){
                nextProps.clearOrderForm();
                nextProps.updateOrderForm({
                    comboId: parseInt(query.comboId) || undefined,
                    themeId: parseInt(query.themeId) || undefined,
                    placeId: parseInt(query.placeId) || undefined
                });

                this.context.router.replace({
                    pathname: '/checkout',
                    query: {
                        from: query.comboId ? 'combo' : (query.themeId ? 'theme' : 'place')
                    }
                });
                return;
            }
        }

        if (!themeId) {
            themeDetailFetching = false;
        } else if (
            !nextProps.themeDetail.meta ||
            nextProps.themeDetail.meta.themeId != themeId ||
            nextProps.themeDetail.meta.cityId != cityId
        ) {
            nextProps.getThemeDetail({
                themeId,
                cityId
            });
        } else {
            themeDetailFetching = nextProps.themeDetail.fetching;
        }

        if (!comboId) {
            comboDetailFetching = false;
        } else if (!nextProps.comboDetail.meta || nextProps.comboDetail.meta.comboId != comboId) {
            nextProps.getComboDetail({
                comboId,
                cityId
            });
        } else {
            comboDetailFetching = nextProps.comboDetail.fetching;
        }

        if (!placeId) {
            placeDetailFetching = false;
        } else if (!nextProps.placeDetail.meta || nextProps.placeDetail.meta.placeId != placeId) {
            nextProps.getPlaceDetail({
                placeId
            });
        } else {
            placeDetailFetching = nextProps.placeDetail.fetching;
        }

        if (nextProps.adultCommodity.data || !comboId) {
            adultCommodityFetching = false;
        }

        if (nextProps.childCommodity.data || !comboId) {
            childCommodityFetching = false;
        }

        if (this.state.mode !== CHECKOUT_MODE_EDIT) {
            orderDetailFetching = false;
        } else if (orderForm.orderCode === nextProps.location.query.orderCode) {
            orderDetailFetching = false;
        } else if (
            orderForm.orderCode !== nextProps.location.query.orderCode &&
            nextProps.orderDetail.data
        ) {
            orderDetailFetching = false;
            this.syncOrderForm(nextProps.orderDetail.data);
            this.loadData(
                Util.getCityId(nextProps.location.query),
                nextProps.orderDetail.data.themeId,
                nextProps.orderDetail.data.placeId,
                nextProps.orderDetail.data.comboId
            );
        }

        this.checkOrderForm(nextProps);

        this.setState({
            fetching: themeDetailFetching ||
                      comboDetailFetching ||
                      placeDetailFetching ||
                      adultCommodityFetching ||
                      childCommodityFetching ||
                      orderDetailFetching
        });
    }

    checkOrderForm (props) {
        var comboInfo = props.comboDetail.data;
        var themeInfo = props.themeDetail.data;
        var orderForm = props.orderForm;
        var resetPlace = false;
        var resetTheme = false;
        var resetCommodity = false;
        var commodityIds = (orderForm.commodities || []).map((item)=>item.id);
        var resetWording = [];
        var reset = {};

        if (themeInfo &&
            orderForm.comboId &&
            orderForm.themeId &&
            themeInfo.id == orderForm.themeId &&
            themeInfo.limitComboIds &&
            themeInfo.limitComboIds.length &&
            themeInfo.limitComboIds.indexOf(orderForm.comboId) < 0
        ) {
            reset.comboId = null;
            this.context.toast.show(`由于您选择的主题限制，您需要重新选择套餐。`);

            props.updateOrderForm(reset);

            return;
        }

        if (!comboInfo || comboInfo.id !== orderForm.comboId) {
            return;
        }

        if (comboInfo.limitPlaceIds &&
            comboInfo.limitPlaceIds.length &&
            orderForm.placeId &&
            comboInfo.limitPlaceIds.indexOf(orderForm.placeId) < 0
        ) {
            resetPlace = true;
        }

        if (comboInfo.limitThemeIds &&
            comboInfo.limitThemeIds.length &&
            orderForm.themeId &&
            comboInfo.limitThemeIds.indexOf(orderForm.themeId) < 0
        ) {
            resetTheme = true;
        }

        if (comboInfo.limitCommodityIds &&
            commodityIds.length &&
            _.intersection(comboInfo.limitCommodityIds, commodityIds).length !== commodityIds.length
        ) {
            resetCommodity = true;
        }

        if (resetPlace) {
            resetWording.push('场馆');
            reset.placeId = null;
        }

        if (resetTheme) {
            resetWording.push('主题');
            reset.themeId = null;
        }

        if (resetCommodity) {
            resetWording.push('增值商品');
            reset.commodities = [];
        }

        if (resetWording.length) {
            this.context.toast.show(`由于您选择的套餐限制，您需要重新选择${resetWording.join('、')}。`);
            props.updateOrderForm(reset);
        }
    }

    syncOrderForm (order) {
        var commodities = (order.addCommodities||[]).map((item) => {
            return {
                id: item.commodityId,
                name: item.commodityName,
                salePrice: item.commodityPrice
            };
        });

        this.props.updateOrderForm({
            orderCode: order.orderCode,
            partyTime: new Date(order.partyTime),
            kidName: order.kidName,
            kidGender: order.kidGender,
            kidBirthday: new Date(order.kidBirthday),
            kidRemark: order.kidRemark,
            partyKidsNumber: order.partyKidsNumber,
            partyParentsNumber: order.partyParentsNumber,
            ticketId: null,
            contactPhone: order.contactPhone,
            placeId: order.placeId,
            themeId: order.themeId,
            comboId: order.comboId,
            commodities
        });
    }

    loadData (cityId, themeId, placeId, comboId) {
        var props = this.props;
        var themeDetail = props.themeDetail.data;
        var placeDetail = props.placeDetail.data;
        var comboDetail = props.comboDetail.data;
        var adultCommodity = props.adultCommodity;
        var childCommodity = props.childCommodity;
        var fetching = false;

        if (themeId) {
            if (!themeDetail ||
                themeDetail.id.toString() !== themeId.toString() ||
                props.themeDetail.meta.cityId.toString() !== cityId.toString()
            ) {
                props.getThemeDetail({
                    themeId,
                    cityId
                });
                fetching = true;
            }
        }

        if (placeId) {
            if (!placeDetail || placeDetail.id.toString() !== placeId.toString()) {
                props.getPlaceDetail({
                    placeId
                });
                fetching = true;
            }
        }

        if (comboId) {
            if (!comboDetail || comboDetail.id.toString() !== comboId.toString()) {
                props.getComboDetail({
                    comboId
                });
                fetching = true;
            }
        }

        if (!adultCommodity.data && (comboDetail || comboId)) {
            props.getAdultCommodity({
                comboId: comboDetail.id || comboId
            });
            fetching = true;
        }

        if (!childCommodity.data && (comboDetail || comboId)) {
            props.getChildCommodity({
                comboId: comboDetail.id || comboId
            });
            fetching = true;
        }

        this.setState({
            fetching,
            cityId
        });
    }

    getComboInfo () {
        return this.props.comboDetail.data;
    }

    submit () {
        var form = this.props.orderForm;
        var comboInfo = this.getComboInfo() || {};
        var childNum = this.props.orderForm.partyKidsNumber || comboInfo.childNum;
        var adultNum = this.props.orderForm.partyParentsNumber || comboInfo.adultNum;

        ORDER_FORM.validate({
            cityId: this.state.cityId,
            comboId: form.comboId,
            placeId: form.placeId,
            themeId: form.themeId,
            partyTime: form.partyTime && dateFormatter(form.partyTime, 'yyyy-mm-dd'),
            kidName: form.kidName,
            kidGender: form.kidGender,
            kidBirthday: form.kidBirthday && dateFormatter(form.kidBirthday, 'yyyy-mm-dd'),
            kidRemark: form.kidRemark,
            partyKidsNumber: childNum,
            partyParentsNumber: adultNum,
            ticketId: null,
            contactPhone: form.contactPhone || this.props.user.data.phone,
            addCommodities: (form.commodities || []).map((item) => ({commodityId: item.id}))
        })
            .then((data) => {
                var request;
                this.setState({
                    submitting: true
                });

                if (this.state.mode === CHECKOUT_MODE_CREATE) {
                    request = BackendAPI.createOrder(data);
                } else {
                    request = BackendAPI.updateOrder(this.state.orderCode, data);
                }

                return request
                    .then((order) => {
                        sendEV('/form/submit/' + order.code);
                        this.context.router.push('/order/' + order.code);
                        this.props.updateOrderForm({
                            orderCode: order.code
                        });
                    });
            })
            .catch((err) => {
                if (err.code === -330004) {
                    window.location.href = 'http://m.party.wanmei.cn/api/session/weixin?callback=' + encodeURIComponent(window.location.href);
                }
                sendEV('/form/error/' + err.message);
                this.refs.toast.show(err.message);
            })
            .then(() => {
                this.setState({
                    submitting: false
                });
            });
    }

    chooseTheme () {
        var orderForm = this.props.orderForm;
        sendEV('/form/choose/theme');
        this.context.router.push({
            pathname: '/checkout/theme',
            query: {
                cityId: this.state.cityId,
                comboId: orderForm.comboId
            }
        });
    }

    chooseCombo () {
        sendEV('/form/choose/combo');
        this.context.router.push({
            pathname: '/checkout/combo',
            query: {
                cityId: this.state.cityId,
                themeId: this.props.orderForm.themeId
            }
        });
    }

    choosePlace () {
        var orderForm = this.props.orderForm;
        sendEV('/form/choose/place');

        this.context.router.push({
            pathname: '/checkout/place',
            query: {
                cityId: this.state.cityId,
                comboId: orderForm.comboId
            }
        });
    }

    chooseCommodity () {
        var comboId = this.props.orderForm.comboId;

        if (!comboId) {
            sendEV('/form/error/请先选择套餐');
            this.refs.toast.show('请先选择套餐');
            return;
        }

        sendEV('/form/choose/commodity');

        this.context.router.push({
            pathname: '/checkout/commodity',
            query: {
                cityId: this.state.cityId,
                comboId
            }
        });
    }

    commitDate () {
        var date = new Date(this.refs.datePicker.getValue());
        this.refs.datepickerPopup.hide();
        sendEV('/form/choose/partyTime');

        if (this.props.orderForm.date &&
            this.props.orderForm.date.getTime() === date.getTime()) {
            return;
        }

        this.props.updateOrderForm({
            partyTime: date
        });
    }

    resizeRemarkTextarea () {
        this.refs.remarkTextarea.style.height = '45px';
        this.refs.remarkTextarea.style.height = this.refs.remarkTextarea.scrollHeight + 'px';
    }

    onTextareaBlur () {
        this.props.updateOrderForm({
            kidRemark: this.refs.remarkTextarea.value
        });
        this.resizeRemarkTextarea();
    }

    onTextareaChange () {
        this.resizeRemarkTextarea();
    }

    getPrice () {
        var comboInfo = this.getComboInfo();
        var price = (comboInfo || {}).showPrice;

        price += this.getExtraPrice();

        return price || 0;
    }

    getExtraPrice () {
        var comboInfo = this.getComboInfo() || {};
        var form = this.props.orderForm;
        var price = 0;
        price += (form.commodities || []).reduce(function (ret, item) {
            return ret + item.salePrice;
        }, 0);

        if (form.partyKidsNumber &&
            form.partyKidsNumber > comboInfo.childNum
        ) {
            price += (form.partyKidsNumber - comboInfo.childNum) * this.props.childCommodity.data.salePrice;
        }

        if (form.partyParentsNumber &&
            form.partyParentsNumber > comboInfo.adultNum
        ) {
            price += (form.partyParentsNumber - comboInfo.adultNum) * this.props.adultCommodity.data.salePrice;
        }

        return price;
    }

    renderDatePicker () {
        return (
            <PopUp ref="datepickerPopup" >
                <div className="popup-head row flex justify">
                    <div className="col-flex">
                        <span className="cancel"
                            onClick={
                                () => {
                                    this.refs.datepickerPopup.hide();
                                }
                            }
                        >取消</span>
                    </div>
                    <div className="col-flex">
                        <span className="confirm" onClick={ this.commitDate.bind(this) }>确定</span>
                    </div>
                </div>
                <DatePicker
                    start={ new Date(Date.now() + 3 * 86400000) }
                    ref="datePicker"
                    selected={ this.props.orderForm.partyTime }
                />
            </PopUp>
        );
    }

    renderBirthdayPicker () {
        var now = new Date();
        return (
            <PopUp ref="birthdayPopup" >
                <div className="popup-head row flex justify">
                    <div className="col-flex">
                        <span className="cancel"
                            onClick={ () => this.refs.birthdayPopup.hide() }
                        >取消</span>
                    </div>
                    <div className="col-flex">
                        <span className="confirm"
                            onClick={
                                () => {
                                    sendEV('/form/choose/birtyday');
                                    this.refs.birthdayPopup.hide();
                                    this.props.updateOrderForm({
                                        kidBirthday: new Date(this.refs.birthdayPicker.getValue())
                                    });
                                }
                            }
                        >确定</span>
                    </div>
                </div>
                <DatePicker
                    start={ new Date((now.getFullYear() - 20) + '-01-01') }
                    end={ now }
                    selected={ this.props.orderForm.kidBirthday || new Date((now.getFullYear() - 5) + '-01-01')}
                    ref="birthdayPicker"
                />
            </PopUp>
        );
    }

    renderPeoplePicker () {
        var comboInfo = this.getComboInfo() || {};
        var selectedChild = this.props.orderForm.partyKidsNumber || comboInfo.childNum;
        var selectedAdult = this.props.orderForm.partyParentsNumber || comboInfo.adultNum;
        var adultPrice;
        var childPrice;
        if (this.props.adultCommodity.data) {
            adultPrice = this.props.adultCommodity.data.salePrice;
        }
        if (this.props.childCommodity.data) {
            childPrice = this.props.childCommodity.data.salePrice;
        }
        var extraPriceText = <span className="people-picker-note">额外增加：大人儿童均免费</span>;
        if (adultPrice === 0 && childPrice !== 0) {
            extraPriceText = <span className="people-picker-note">额外增加：大人免费 {childPrice}元/小孩</span>;
        } else if (adultPrice !== 0 && childPrice === 0) {
            extraPriceText = <span className="people-picker-note">额外增加：{adultPrice}元/大人 小孩免费</span>;
        } else if(adultPrice !== 0 && childPrice !== 0){
            extraPriceText = <span className="people-picker-note">额外增加：{adultPrice}元/大人 {childPrice}元/小孩</span>;
        }
        return (
            <PopUp ref="peoplePicker">
                <div className="popup-head row flex justify">
                    <div className="col-flex">
                        <span className="cancel"
                            onClick={
                                () => {
                                    this.refs.peoplePicker.hide();
                                }
                            }
                        >取消</span>
                    </div>
                    <div className="col-flex">
                        <span className="confirm"
                            onClick={
                                () => {
                                    sendEV('/form/choose/peopleCount');
                                    this.refs.peoplePicker.hide();
                                    this.props.updateOrderForm({
                                        partyKidsNumber: this.refs.childCountPicker.getValue(),
                                        partyParentsNumber: this.refs.adultCountPicker.getValue()
                                    });
                                }
                            }
                        >确定</span>
                    </div>
                </div>
                {extraPriceText}
                <div className="people-picker row flex">
                    <div className="col-flex">
                        <Picker options={ _.range(1, 100) }
                            label="个大人"
                            selected={ selectedAdult - 1 }
                            ref="adultCountPicker"
                        />
                    </div>
                    <div className="col-flex">
                        <Picker options={ _.range(1, 100) }
                            label="个小孩"
                            selected={ selectedChild - 1 }
                            ref="childCountPicker"
                        />
                    </div>
                </div>
            </PopUp>
        );
    }

    renderThemeField () {
        var themeDetail = this.props.themeDetail;
        var orderForm = this.props.orderForm;
        var text = <span className="field-placeholder">主题选择</span>;

        if (orderForm.themeId &&
            themeDetail.data &&
            orderForm.themeId === themeDetail.data.id
        ) {
            text = <span className="field-text">{ themeDetail.data.title }</span>;
        }
        return (
            <div className="field"
                onClick={ this.chooseTheme.bind(this) }
            >
                <i className="sprite-order-theme" />
                { text }
                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderComboField () {
        var comboInfo = this.getComboInfo() || {};
        var orderForm = this.props.orderForm;

        var text = <span className="field-placeholder">
            套餐选择
        </span>;

        if (orderForm.comboId &&
            comboInfo &&
            comboInfo.id === orderForm.comboId) {
            text = <span className="field-text">
                {comboInfo.name}
                <span className="price"> <em>¥{ comboInfo.showPrice }</em></span>
            </span>;
        }

        return (
            <div className="field" onClick={ () => this.chooseCombo()}>
                <i className="sprite-order-combo" />
                { text }
                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderPlaceField () {
        var placeDetail = this.props.placeDetail;
        var orderForm = this.props.orderForm;

        var text = <span className="field-placeholder">场地选择</span>;

        if (orderForm.placeId &&
            placeDetail.data &&
            placeDetail.data.id === orderForm.placeId
        ) {
            text = <span className="field-text">
                { placeDetail.data.name }
                <span className="place-address">{ placeDetail.data.address }</span>
                </span>;
        }

        return (
            <div className="field field-place"
                onClick={ this.choosePlace.bind(this) }
            >
                <i className="sprite-map-mark" />
                { text }
                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderPhoneField () {
        var user = this.props.user.data || {};

        return (
            <div className="field">
                <i className="sprite-phone" />
                <input type="tel" className="field-input" maxLength="11"
                    placeholder={ user.phone || '请输入手机号码' }
                    defaultValue={ this.props.orderForm.contactPhone }
                    onBlur={
                        (e) => {
                            this.props.updateOrderForm({
                                contactPhone: e.target.value
                            });
                        }
                    }
                />
            </div>
        );
    }

    renderPartyTimeField() {
        var form = this.props.orderForm;

        return (
            <div className="field"
                onClick={
                    () => this.refs.datepickerPopup.show()
                }
            >
                <i className="sprite-clock" />
                {
                    form.partyTime ?
                        (<span className="field-text"><em>{ formatDate(form.partyTime) }</em></span>) :
                        (<span className="field-placeholder">举办时间</span>)
                }

                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderPeopleField () {
        var comboInfo = this.getComboInfo();
        var selectedChild = this.props.orderForm.partyKidsNumber || (comboInfo || {}).childNum;
        var selectedAdult = this.props.orderForm.partyParentsNumber || (comboInfo || {}).adultNum;

        var text = <span className="field-placeholder">请选择人数<sub>（超出套餐人数必选）</sub></span>;

        if (selectedChild || selectedAdult) {
            text = <span className="field-text">
                大人：{selectedAdult}个，小孩：{selectedChild}个
            </span>;
        }

        return (
            <div className="field" onClick={
                () => {
                    if (!comboInfo) {
                        this.refs.toast.show('请先选择套餐');
                        return;
                    }
                    this.refs.peoplePicker.show();
                }
            }>
                <i className="sprite-people" />
                { text }
                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderCommodityField () {
        var commodities = this.props.orderForm.commodities || [];
        var text = <span className="field-placeholder">增值服务<sub>（魔术、泡泡秀、气球表演等）</sub></span>;

        if (commodities.length) {
            text = (
                <p className="field-text">
                {
                    commodities.map((item) => {
                        return [item.name, <br />];
                    })
                }
                </p>
            );
        }

        return (
            <div className="field"
                onClick={ () => this.chooseCommodity() }
            >
                <i className="sprite-smile" />
                { text }
                <i className="sprite-angle-right" />
            </div>
        );
    }

    renderGenderField () {
        var form = this.props.orderForm;

        return (
            <div className="field">
                <i className="sprite-pencil" />
                <label htmlFor="kidName" className="field-label"><i>小</i><i>寿</i><i>星</i></label>
                <input className="field-input field-kidname"
                    type="text"
                    placeholder="请输入姓名"
                    defaultValue={ this.props.orderForm.kidName || ''}
                    onBlur= {
                        (e) => this.props.updateOrderForm({
                            kidName: e.target.value.trim()
                        })
                    }
                />
                <div className="field-gender">
                    <label
                        onClick={
                            () => {
                                this.props.updateOrderForm({
                                    kidGender: 1
                                });
                            }
                        }
                    >
                        <i className={`sprite-radio-${form.kidGender === 1 ? 'on' : 'off'}`}/>
                        <span>男</span>
                    </label>
                    <label
                        onClick={
                            () => {
                                this.props.updateOrderForm({
                                    kidGender: 2
                                });
                            }
                        }
                    >
                        <i className={`sprite-radio-${form.kidGender === 2 ? 'on' : 'off'}`}/>
                        <span>女</span>
                    </label>
                </div>
            </div>
        );
    }

    renderBirthdayField () {
        var form = this.props.orderForm;

        return (
            <div className="field"
                onClick={
                    () => this.refs.birthdayPopup.show()
                }
            >
                <label className="field-label"><i>生</i><i>日</i></label>
                {
                    form.kidBirthday ?
                        (<span className="field-text">{ formatDate(form.kidBirthday) }</span>) :
                        null
                }
            </div>
        );
    }

    renderRemarkField () {
        var form = this.props.orderForm;

        return (
            <div className="field field-remark">
                <label className="field-label"><i>备</i><i>注</i></label>
                <textarea className="field-textarea"
                    ref="remarkTextarea"
                    name="remark"
                    placeholder="孩子喜欢的颜色、忌口等"
                    onBlur={ this.onTextareaBlur.bind(this) }
                    onChange={ this.onTextareaChange.bind(this) }
                    defaultValue={ form.kidRemark || '' }
                />
            </div>
        );
    }

    renderFooter () {
        var extraPrice = this.getExtraPrice();

        if (extraPrice) {
            extraPrice = (<span className="extra">含套餐外增加费用{ extraPrice }元</span>);
        } else {
            extraPrice = null;
        }

        var btnClassName = "btn btn-middle btn-block ";

        if (this.state.submitting) {
            btnClassName += 'btn-gray';
        } else {
            btnClassName += 'btn-pink';
        }

        return (
            <div className="foot">
                <div className="foot-wrapper row flex middle justify">
                    <div className="col-flex">
                        <span className="price">合计：<em>¥{ this.getPrice() }</em></span>
                        { extraPrice }
                    </div>
                    <div className="col-4">
                        <a href="javascript: void(0);"
                            className={ btnClassName }
                            onClick={ this.submit.bind(this) }
                        >确认提交</a>
                    </div>
                </div>
            </div>
        );
    }

    renderMainThemeField() {
        var themeDetail = this.props.themeDetail.data;
        return (
            <div className="field-group">
                <div className="field-main row flex middle"
                    onClick={ () => this.chooseTheme() }
                >
                    <div className="combo-image">
                        <ResponsiveImage src={ themeDetail.detailImgUrl } ratio={1}/>
                    </div>
                    <div className="combo-info col-flex">
                        <h1 className="combo-title">{ themeDetail.title }</h1>
                        <p className="combo-desc">{ themeDetail.description }</p>
                    </div>
                    <i className="sprite-angle-right" />
                </div>
                { this.renderComboField() }
                { this.renderPlaceField() }
            </div>
        );
    }

    renderMainComboField() {
        var comboDetail = this.props.comboDetail.data;

        return (
            <div className="field-group">
                <div className="field-main row flex middle"
                    onClick={ () => this.chooseCombo() }
                >
                    <div className="combo-image">
                        <ResponsiveImage src={ comboDetail.thumbImgUrl } ratio={1}/>
                    </div>
                    <div className="combo-info col-flex">
                        <h1 className="combo-title">{ comboDetail.name }</h1>
                        <p className="combo-desc">{ comboDetail.description }</p>
                        <span className="combo-price">¥<em>{ comboDetail.showPrice }</em></span>
                    </div>
                    <i className="sprite-angle-right" />
                </div>
                { this.renderThemeField() }
                { this.renderPlaceField() }
            </div>
        );
    }

    renderMainPlaceField() {
        var placeDetail = this.props.placeDetail.data;

        return (
            <div className="field-group">
                <div className="field-main row flex middle"
                    onClick={ () => this.choosePlace() }
                >
                    <div className="combo-image">
                        <ResponsiveImage src={ placeDetail.placeImgUrl } ratio={ 1 } />
                    </div>
                    <div className="combo-info col-flex">
                        <h1 className="combo-title">{ placeDetail.name }</h1>
                        <p className="combo-desc">{ placeDetail.address }</p>
                    </div>
                    <i className="sprite-angle-right" />
                </div>
                { this.renderComboField() }
                { this.renderThemeField() }
            </div>
        );
    }

    renderMainField () {
        var query = this.props.location.query;
        var orderForm = this.props.orderForm;
        var type = query.from;

        if (type === 'theme' && orderForm.themeId) {
            return this.renderMainThemeField();
        } else if (type === 'combo' && orderForm.comboId) {
            return this.renderMainComboField();
        } else if (type === 'place' && orderForm.placeId) {
            return this.renderMainPlaceField();
        } else {
            return <div className="field-group">
                { this.renderComboField() }
                { this.renderThemeField() }
                { this.renderPlaceField() }
            </div>;
        }
    }

    render () {
        if (this.state.error) {
            return (<Loading message={ this.state.error.message } disableAnimate={ true } />);
        }

        if (this.state.fetching) {
            return (<Loading />);
        }

        return (
            <div className="page page-checkout">
                <Toast ref="toast"/>
                { this.renderMainField() }
                <div className="field-group">
                    { this.renderPartyTimeField() }
                    { this.renderPeopleField() }
                    { this.renderCommodityField() }
                </div>
                <div className="field-group child-info">
                    { this.renderGenderField() }
                    { this.renderBirthdayField() }
                    { this.renderRemarkField() }
                </div>

                <a href={`tel:${SERVICE_PHONE}`}
                    className="service-btn btn btn-large btn-blue btn-ghost btn-block"
                >客服电话：{ SERVICE_PHONE.replace(/^(\d{3})(\d{4})(\d*)$/, '$1-$2-$3') }</a>

                { this.renderFooter() }

                { this.renderDatePicker() }
                { this.renderBirthdayPicker() }
                { this.renderPeoplePicker() }
            </div>
        );
    }
}

CheckoutPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    toast: React.PropTypes.object.isRequired
};

function formatDate (date) {
    return dateFormatter(date, 'yyyy年m月d日');
}

function sendEV (log) {
    Logger.sendEV('/checkout', log);
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getThemeDetail,
        getOrderDetail,
        updateOrderForm,
        getAdultCommodity,
        getChildCommodity,
        getCurrentUser,
        getPlaceDetail,
        getComboDetail,
        clearOrderForm
    }, dispatch)
)(CheckoutPage);
