/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React, { PropTypes } from 'react-mod'

import TabPanel         from 'vntd-shared/layout/TabPanel.jsx';
import StarRating       from 'vntd-shared/layout/StarRating.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import LikeStat         from 'vntd-root/components/LikeStat.jsx';
import PostComment      from 'vntd-root/components/PostComment.jsx';

class ProductInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._productImages  = this._productImages.bind(this);
        this._getProductTabs = this._getProductTabs.bind(this);
        this._productDesc    = this._productDesc.bind(this);
        this._renderProduct  = this._renderProduct.bind(this);
    }

    openModal() {
        this.refs.modal.openModal();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    _productImages(uuid, images) {
        const itemId = `product-img-${uuid}`;
        const itemRef = `#${itemId}`;

        let inner = [];
        let indicators = [];
        for (let i = 0; i < images.length; i++) {
            const clsn = i === 0 ? "active" : "";
            indicators.push(
                <li key={_.uniqueId('prod-car-')} data-target={itemRef} data-slide-to={i.toString} className={clsn}></li>
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
                    <a className="right carousel-control" href={itemRef} data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </a>
                </div>
            </div>
        );
    }

    _getProductTabs(uuid) {
        return {
            containerFmt: 'description description-tabs',
            headerFmt   : 'nav nav-pills',
            contentFmt  : 'tab-content',
            tabItems: [ {
                domId  : 'prod-tab-desc-' + uuid,
                tabText: 'Product Description',
                paneFmt: 'fade in',
                tabIdx : 0
            }, {
                domId  : 'prod-tab-spec-' + uuid,
                tabText: 'Specifications',
                paneFmt: 'fade',
                tabIdx : 1
            }, {
                domId  : 'prod-tab-review-' + uuid,
                tabText: 'Reviews',
                paneFmt: 'fade in',
                tabIdx : 2
            } ]
        };
    }

    _productDesc(uuid, productTitle, productDesc, productSpec) {
        let tabData = this._getProductTabs(uuid);
        return (
            <TabPanel context={tabData}>
                <div>
                    <strong>{productTitle}</strong>
                    <div dangerouslySetInnerHTML={{__html: productDesc}}/>
                </div>
                <div dangerouslySetInnerHTML={{__html: productSpec}}/>
                <PostComment articleUuid={uuid}/>
            </TabPanel>
        );
    }

    _renderProduct() {
        const {
            uuid, productTitle, price, priceNotice, productSub,
            productTags, productDesc, productSpec, productImgs
        } = this.props.product;

        let prodTab = this._productDesc(uuid, productTitle, productDesc, productSpec);
        let tagLength = productTags.length;
        let prodTags = [];

        for (let i = 0; i < tagLength; i++) {
            prodTags.push(
                <li key={_.uniqueId('prod-info-')}><div dangerouslySetInnerHTML={{__html: productTags[i]}}/></li>
            );
        }
        return (
            <div className="product-content product-wrap clearfix product-deatil">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        {this._productImages(uuid, productImgs)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <h2 className="name">
                                    {productTitle}
                                    <div dangerouslySetInnerHTML={{__html: productSub}}/>
                                </h2>
                                <StarRating name={uuid} value={7} />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <h3 className="price-container">
                                    {price}
                                    <small>{priceNotice}</small>
                                </h3>
                            </div>
                        </div>
                        <hr/>
                        <div className="certified">
                            <ul>{prodTags}</ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        {prodTab}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6"> 
                        <a href="javascript:void(0);" className="btn btn-success btn-lg">Add to cart {price}</a>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="btn-group pull-right">
                            <button className="btn btn-white btn-default">
                                <i className="fa fa-star"></i> Add to wishlist
                            </button>
                            <button className="btn btn-white btn-default">
                                <i className="fa fa-envelope"></i> Contact Seller
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.modal === true) {
            return (
                <ModalConfirm ref={'modal'} modalTitle={"Product"}>
                    {this._renderProduct()}
                </ModalConfirm>
            );
        }
        return this._renderProduct();
    }
}

ProductInfo.propTypes = {
    product: PropTypes.shape({
        uuid        : PropTypes.string.isRequired,
        price       : PropTypes.string.isRequired,
        priceNotice : PropTypes.string,
        productTitle: PropTypes.string.isRequired,
        productDesc : PropTypes.string.isRequired,
        productSpec : PropTypes.string.isRequired,
        productImgs : PropTypes.arrayOf(PropTypes.string).isRequired,
        productTags : PropTypes.arrayOf(PropTypes.string)
    })
};

class ProductBrief extends React.Component
{
    constructor(props) {
        super(props);

        this._addCart     = this._addCart.bind(this);
        this._getDetail   = this._getDetail.bind(this);
        this._clickSelect = this._clickSelect.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _addCart() {
    }

    _getDetail() {
    }

    _clickSelect() {
        this.refs.modal.openModal();
    }

    render() {
        let onClickCb = this.props.onClickCb;
        const {
            logoImg, logoWidth, logoHeight, logoTag, likeStat,
            uuid, rating, productName, productCat, price, productDesc
        } = this.props.product;

        if (onClickCb == null) {
            onClickCb = this._clickSelect;
        }
        //<img src={logoImg} width={logoWidth} height={logoHeight} className='img-responsive'/>
        return (
            <div className="product-content product-wrap clearfix" onClick={onClickCb}>
                <div className="row">
                    <ProductInfo ref={"modal"} modal={true} product={this.props.product}/>
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <div className="product-image" style={{minHeight: "150"}}>
                            <img src={logoImg} className='img-responsive'/>
                        </div>
                        {logoTag ? <span className='tag2 hot'>{logoTag}</span> : null}
                        <LikeStat data={likeStat} split={true}/>
                        <StarRating name={`prod-${uuid}`} value={rating}/>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="product-deatil">
                            <h5 className="name">
                                <a href="#">{productName}<span>{productCat}</span></a>
                            </h5>
                            <p className="price-container"><span>{price}</span></p>
                            <span className="tag1"></span>
                        </div>
                        <div className="description">
                            {/*productDesc*/}
                        </div>
                        <div className="product-info smart-form">
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-6">
                                    <button className="btn btn-success" onClick={this._addCart}>Add to cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProductBrief.propTypes = {
    product: PropTypes.shape({
        logoImg    : PropTypes.string.isRequired,
        logoWidth  : PropTypes.number,
        logoHeight : PropTypes.number,
        logoTag    : PropTypes.string,
        likeStat   : PropTypes.object,
        uuid       : PropTypes.string,
        price      : PropTypes.string.isRequired,
        rating     : PropTypes.number,
        productName: PropTypes.string.isRequired,
        productCat : PropTypes.string,
        productDesc: PropTypes.string.isRequired
    })
};

ProductBrief.defaultProps = {
    product: {
        logoWidth : 40,
        logoHeight: 40
    }
};

export { ProductBrief, ProductInfo };
