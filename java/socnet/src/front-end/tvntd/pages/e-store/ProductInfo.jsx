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

        if (images == null) {
            return null;
        }
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

    _productDesc(uuid, prodTitle, prodDesc, prodSpec) {
        let tabData = this._getProductTabs(uuid);
        return (
            <TabPanel context={tabData}>
                <div>
                    <strong>{prodTitle}</strong>
                    <div dangerouslySetInnerHTML={{__html: prodDesc}}/>
                </div>
                <div dangerouslySetInnerHTML={{__html: prodSpec}}/>
                <PostComment articleUuid={uuid}/>
            </TabPanel>
        );
    }

    _renderProduct() {
        const {
            articleUuid, prodTitle, prodPrice, priceNotice, prodSub,
            prodTags, prodDesc, prodSpec, prodImgs
        } = this.props.product;

        let prodTab = this._productDesc(articleUuid, prodTitle, prodDesc, prodSpec);
        let productTags = [];

        if (prodTags != null) {
            let tagLength = prodTags.length;
            for (let i = 0; i < tagLength; i++) {
                productTags.push(
                    <li key={_.uniqueId('prod-info-')}><div dangerouslySetInnerHTML={{__html: prodTags[i]}}/></li>
                );
            }
        }
        return (
            <div className="product-content product-wrap clearfix product-deatil">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        {this._productImages(articleUuid, prodImgs)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <h2 className="name">
                                    {prodTitle}
                                    <div dangerouslySetInnerHTML={{__html: prodSub}}/>
                                </h2>
                                <StarRating name={articleUuid} value={7} />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <h3 className="price-container">
                                    {prodPrice}
                                    <small>{priceNotice}</small>
                                </h3>
                            </div>
                        </div>
                        <hr/>
                        <div className="certified">
                            <ul>{productTags}</ul>
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
                        <a href="javascript:void(0);" className="btn btn-success btn-lg">Add to cart {prodPrice}</a>
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
        articleUuid: PropTypes.string.isRequired,
        prodPrice  : PropTypes.string.isRequired,
        priceNotice: PropTypes.string,
        prodTitle  : PropTypes.string.isRequired,
        prodDesc   : PropTypes.string.isRequired,
        prodSpec   : PropTypes.string.isRequired,
        prodImgs   : PropTypes.arrayOf(PropTypes.string).isRequired,
        prodTags   : PropTypes.arrayOf(PropTypes.string)
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
            articleUuid, rating, prodName, prodCat, prodPrice, prodDesc
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
                        {/*
                            <StarRating name={`prod-${articleUuid}`} value={rating}/>*/}
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="product-deatil">
                            <h5 className="name">
                                <a href="#">{prodName}<span>{prodCat}</span></a>
                            </h5>
                            <p className="price-container"><span>{prodPrice}</span></p>
                            <span className="tag1"></span>
                        </div>
                        <div className="description">
                            {/*prodDesc*/}
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
        articleUuid: PropTypes.string,
        prodPrice  : PropTypes.string.isRequired,
        rating     : PropTypes.number,
        prodName   : PropTypes.string.isRequired,
        prodCat    : PropTypes.string,
        prodDesc   : PropTypes.string.isRequired
    })
};

ProductBrief.defaultProps = {
    product: {
        logoWidth : 40,
        logoHeight: 40
    }
};

export { ProductBrief, ProductInfo };
