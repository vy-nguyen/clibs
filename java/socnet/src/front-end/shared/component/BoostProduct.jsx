/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';
import StarRating        from 'react-star-rating';

import StateButtonStore  from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton       from 'vntd-shared/utils/StateButton.jsx';
import ModalConfirm      from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import TabPanel          from 'vntd-shared/layout/TabPanel.jsx';
import PostComment       from 'vntd-root/components/PostComment.jsx';
import {VntdGlob}        from 'vntd-root/config/constants.js';

const defaultProps = {
    product: {
        articleUuid: "0xabcdef",
        pictureUrl: [
            "/rs/user/3/fd/26/a623eb25f4481f4ad3a53007e7dc05f4fae1",
            "/rs/user/3/fc/61/e87980642f9632c94abf69b1c95ee53c190b",
            "/rs/user/3/f7/d6/4cb522557c9adc2b9996a5037f2e18545832"
        ],
        prodTitle: "Corsair G5600 600 Watt PSU",
        prodSub  : "",
        prodDesc : "The corsair Gaming Series is the ideal price/performance",
        prodPrice: "123.43",
        priceNotice: "Free shipping",
        prodDetail :
`<section className='container product-info'>\
The Corsair Gaming Series GS600 power supply is the ideal price-performance solution for building or upgrading a Gaming PC. A single +12V rail provides up to 48A of reliable, continuous power for multi-core gaming PCs with multiple graphics cards. The ultra-quiet, dual ball-bearing fan automatically adjusts its speed according to temperature, so it will never intrude on your music and games.  Blue LEDs bathe the transparent fan blades in a cool glow. Not feeling blue? You can turn off the lighting with the press of a button.\
    <h3>Corsair Gaming Series GS600 Features:</h3> \
    <li>It supports the latest ATX12V v2.3 standard and is backward compatible with ATX12V 2.2 and ATX12V 2.01 systems</li> \
    <li>An ultra-quiet 140mm double ball-bearing fan delivers great airflow at an very low noise level by varying fan speed in response to temperature</li> \
    <li>80Plus certified to deliver 80% efficiency or higher at normal load conditions (20% to 100% load)</li> \
    <li>0.99 Active Power Factor Correction provides clean and reliable power</li> \
    <li>Universal AC input from 90~264V — no more hassle of flipping that tiny red switch to select the voltage input!</li> \
    <li>Extra long fully-sleeved cables support full tower chassis</li> \
    <li>A three year warranty and lifetime access to Corsair’s legendary technical support and customer service</li> \
    <li>Over Current/Voltage/Power Protection, Under Voltage Protection and Short Circuit Protection provide complete component safety</li> \
    <li>Dimensions: 150mm(W) x 86mm(H) x 160mm(L)</li> \
    <li>MTBF: 100,000 hours</li> \
    <li>Safety Approvals: UL, CUL, CE, CB, FCC Class B, TÜV, CCC, C-tick</li> \
</section>`,
        prodSpec:
`<section className='container product-info'>\
The Corsair Gaming Series GS600 power supply is the ideal price-performance solution for building or upgrading a Gaming PC. A single +12V rail provides up to 48A of reliable, continuous power for multi-core gaming PCs with multiple graphics cards. The ultra-quiet, dual ball-bearing fan automatically adjusts its speed according to temperature, so it will never intrude on your music and games.  Blue LEDs bathe the transparent fan blades in a cool glow. Not feeling blue? You can turn off the lighting with the press of a button.\
</section>`
    }
};

export class BoostProdTab extends React.Component
{
    constructor(props) {
        super(props);

        this._productDetail = this._productDetail.bind(this);
    }

    _getProductTabs(uuid) {
        return {
            containerFmt: 'description description-tabs',
            headerFmt   : 'nav nav-pills',
            contentFmt  : 'tab-content',
            tabItems: [ {
                domId  : 'prod-tab-desc-' + uuid,
                tabText: 'Product Description',
                paneFmt: '',
                tabIdx : 0
            }, {
                domId  : 'prod-tab-spec-' + uuid,
                tabText: 'Specifications',
                paneFmt: '',
                tabIdx : 1
            }, {
                domId  : 'prod-tab-review-' + uuid,
                tabText: 'Reviews',
                paneFmt: '',
                tabIdx : 2
            } ]
        };
    }

    _productDetail(uuid, prodTitle, prodDetail, prodSpec) {
        let tabData = this._getProductTabs(uuid);
        return (
            <TabPanel context={tabData}>
                <div>
                    <strong>{prodTitle}</strong>
                    <div dangerouslySetInnerHTML={{__html: prodDetail}}/>
                </div>
                <div>
                    <div dangerouslySetInnerHTML={{__html: prodSpec}}/>
                </div>
                <PostComment articleUuid={uuid}/>
            </TabPanel>
        );
    }

    render() {
        let prod = this.props.product;

        return this._productDetail(
            prod.articleUuid, prod.prodTitle, prod.prodDetail, prod.prodSpec
        );
    }
}

export class BoostProdImage extends React.Component
{
    constructor(props) {
        super(props);
    }

    openModal() {
        this.refs.modal.openModal();
    }

    _renderImage(uuid, images) {
        const itemId = `product-img-${uuid}`;
        const itemRef = `#${itemId}`;

        if (images == null) {
            return null;
        }
        let inner = [], indicators = [];

        for (let i = 0; i < images.length; i++) {
            const clsn = i === 0 ? "active" : "";
            indicators.push(
                <li key={_.uniqueId('prod-car-')}
                    data-target={itemRef} data-slide-to={i.toString} className={clsn}>
                </li>
            );
            inner.push(
                <div key={_.uniqueId('prod-car-')} className={`item ${clsn}`}>
                    <img src={images[i]}/>
                </div>
            );
        }
        return (
            <div className="product-image">
                <div id={itemId} className="carousel slide">
                    <ol className="carousel-indicators">
                        {indicators}
                    </ol>
                    <div className="carousel-inner">
                        {inner}
                    </div>
                    <a className="left carousel-control" href={itemRef} data-slide="prev">
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </a>
                    <a className="right carousel-control"
                        href={itemRef} data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </a>
                </div>
            </div>
        );
    }

    render() {
        let { articleUuid, images, modal } = this.props;

        if (modal === true) {
            return (
                <ModalConfirm ref="modal" modalTitle="Product">
                    {this._renderImage(articleUuid, images)}
                </ModalConfirm>
            );
        }
        return this._renderImage(articleUuid, images);
    }
}

export class BoostProdShopBtn extends React.Component
{
    constructor(props) {
        super(props);
        let uuid = props.articleUuid;

        this.state = {
            shopBtn: 'shop-btn-' + uuid,
            wishBtn: 'wish-btn-' + uuid,
            mailBtn: 'mail-btn-' + uuid
        };
        this._addCart    = this._addCart.bind(this);
        this._addWish    = this._addWish.bind(this);
        this._mailSeller = this._mailSeller.bind(this);

        StateButtonStore.createButton(this.state.shopBtn, () => {
            return StateButton.toggleButton("Add to cart", "Remove from cart");
        }, 'on');
        StateButtonStore.createButton(this.state.wishBtn, () => {
            return StateButton.toggleButton("Add to wishlist", "Remove from wishlist");
        }, 'on');
        StateButtonStore.createButton(this.state.mailBtn, () => {
            return StateButton.toggleButton("Contact Seller", "Mailed Seller");
        }, 'on');
    }

    _addCart() {
        console.log("add cart...");
        StateButtonStore.goNextState(this.state.shopBtn);
    }

    _addWish() {
        console.log("add wish...");
        StateButtonStore.goNextState(this.state.wishBtn);
    }

    _mailSeller() {
        console.log("mail seller...");
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="btn-group cart">
                        <StateButton btnId={this.state.shopBtn} onClick={this._addCart}/>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="btn-group wishlist">
                        <StateButton btnId={this.state.wishBtn} onClick={this._addWish}>
                            <i className="fa fa-star"/>
                        </StateButton>
                        <StateButton btnId={this.state.mailBtn}
                            onClick={this._mailSeller}>
                            <i className="fa fa-envelope"/>
                        </StateButton>
                    </div>
                </div>
            </div>
        );
    }
}

export class BoostProdDesc extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            mainImg: props.product.pictureUrl[0]
        };
    }

    _renderProductInfo(prod) {
        return (
            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <div className="product-title">
                    {prod.prodTitle}
                </div>
                <div className="product-desc"
                    dangerouslySetInnerHTML={{__html: prod.prodSub}}>
                </div>
                <div className="product-desc">
                    {prod.prodDesc}
                </div>
                <StarRating size={15} totalStars={5} rating={4} disabled={true}/>
                <hr/>
                <div className="product-price">$ {prod.prodPrice}</div>
                <div><small>{prod.priceNotice}</small></div>
                <div className="product-stock">In Stock</div>
                <hr/>
                <BoostProdShopBtn articleUuid={prod.articleUuid}/>
             </div>
        );
    }

    _renderThumbs(prod) {
        return prod.pictureUrl.map(function(it) {
            return (
                <a key={_.uniqueId()} onClick={this._onClickThumb.bind(this, it)}>
                    <img src={it} style={VntdGlob.styleFit}/>
                </a>
            );
        }.bind(this));
    }

    _onClickThumb(imgUrl) {
        console.log("click imgUrl " + imgUrl);
        this.setState({
            mainImg: imgUrl
        });
    }

    render() {
        let product = this.props.product,
        thumbs = this._renderThumbs(product),
        pinfo  = this._renderProductInfo(product);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-8 col-sm-8 col-md-5 col-lg-5">
                    <center>
                        <img style={VntdGlob.styleFit} src={this.state.mainImg}/>
                    </center>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-2 col-lg-2 pull-left">
                    {thumbs}
                </div>
                {pinfo}
            </div>
        );
    }
}

class BoostProduct extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="content-wrapper">
                    <BoostProdDesc {...this.props}/>
                </div>
                <div className="content-wrapper">
                    <BoostProdTab {...this.props}/>
                </div>
            </div>
        );
    }
}

BoostProduct.defaultProps = defaultProps;
BoostProduct.propTypes = {
    product: PropTypes.shape({
        prodTitle  : PropTypes.string.isRequired,
        prodDesc   : PropTypes.string.isRequired,
        articleUuid: PropTypes.string.isRequired,
        pictureUrl : PropTypes.arrayOf(PropTypes.string).isRequired
    })
};

export default BoostProduct;
