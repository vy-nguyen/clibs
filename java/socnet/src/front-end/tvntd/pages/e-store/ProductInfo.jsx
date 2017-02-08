/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React, { PropTypes } from 'react-mod'

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import TabPanel         from 'vntd-shared/layout/TabPanel.jsx';
import StarRating       from 'vntd-shared/layout/StarRating.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import LikeStat         from 'vntd-root/components/LikeStat.jsx';
import PostComment      from 'vntd-root/components/PostComment.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import EStorePost       from './EStorePost.jsx';

class ProductInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._productImages  = this._productImages.bind(this);
        this._getProductTabs = this._getProductTabs.bind(this);
        this._productDetail  = this._productDetail.bind(this);
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
                <li key={_.uniqueId('prod-car-')} data-target={itemRef} data-slide-to={i.toString} className={clsn}>
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

    _productDetail(uuid, prodTitle, prodDetail, prodSpec) {
        let tabData = this._getProductTabs(uuid);
        return (
            <TabPanel context={tabData}>
                <div>
                    <strong>{prodTitle}</strong>
                    <div dangerouslySetInnerHTML={{__html: prodDetail}}/>
                </div>
                <div dangerouslySetInnerHTML={{__html: prodSpec}}/>
                <PostComment articleUuid={uuid}/>
            </TabPanel>
        );
    }

    _renderProduct() {
        const {
            articleUuid, prodTitle, prodPrice, priceNotice, prodSub,
            prodTags, prodDetail, prodSpec, pictureUrl
        } = this.props.product;

        let prodTab = this._productDetail(articleUuid, prodTitle, prodDetail, prodSpec);
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
                        {this._productImages(articleUuid, pictureUrl)}
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
        pictureUrl : PropTypes.arrayOf(PropTypes.string).isRequired,
        prodPrice  : PropTypes.string.isRequired,
        priceNotice: PropTypes.string,
        prodTitle  : PropTypes.string.isRequired,
        prodDetail : PropTypes.string.isRequired,
        prodSpec   : PropTypes.string.isRequired,
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
        this._delProduct  = this._delProduct.bind(this);
        this._editProduct = this._editProduct.bind(this);
        this._confirmDel  = this._confirmDel.bind(this);
        this._cancelDel   = this._cancelDel.bind(this);
        this._delConfirmBox = this._delConfirmBox.bind(this);
        this._editProductModal = this._editProductModal.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _addCart(event) {
        console.log("add cart");
        event.stopPropagation();
    }

    _delProduct(event) {
        event.stopPropagation();
        this.refs.confirmRm.openModal();
    }

    _editProduct(event) {
        event.stopPropagation();
        console.log("Edit product");
        this.refs.editProd.openModal();
    }

    _confirmDel() {
        this.refs.confirmRm.closeModal();
        Actions.deleteProduct({
            authorUuid: UserStore.getSelfUuid(),
            uuidType  : "product",
            uuids     : [ this.props.product.articleUuid ]
        });
    }

    _cancelDel() {
        this.refs.confirmRm.closeModal();
    }

    _getDetail() {
    }

    _clickSelect(event) {
        this.refs.modal.openModal();
    }

    _delConfirmBox() {
        return (
            <ModalConfirm ref={"confirmRm"} height={"auto"} modalTitle={"Delete this product listing?"}>
                <div className="modal-footer">
                    <button className="btn btn-primary pull-right" onClick={this._confirmDel}>Delete</button>
                    <button className="btn btn-default pull-right" onClick={this._cancelDel}>Cancel</button>
                </div>
            </ModalConfirm>
        );
    }

    _editProductModal() {
        return (
            <ModalConfirm ref={"editProd"} modalTitle={"Edit Product Listing"}>
                <div className="modal-content">
                    <EStorePost/>
                </div>
            </ModalConfirm>
        );
    }

    render() {
        let editBox, delBox, button, onClickCb = this.props.onClickCb;
        const {
            logoImg, logoWidth, logoHeight, logoTag, likeStat,
            articleUuid, rating, prodName, prodCat, prodPrice, prodDesc
        } = this.props.product;

        if (onClickCb == null) {
            onClickCb = this._clickSelect;
        }
        if (UserStore.isUserMe(this.props.userUuid)) {
            editBox = this._editProductModal();
            delBox = this._delConfirmBox();
            button = (
                <div className="btn-group" role="group">
                    <button className="btn btn-info" onClick={this._editProduct}>Edit Post</button>
                    <button className="btn btn-danger" onClick={this._delProduct}>Remove Product</button>
                </div>
            );
        } else {
            editBox = null;
            delBox = null;
            button = <button className="btn btn-success" onClick={this._addCart}>Add to cart</button>;
        }
        return (
            <div className="product-content product-wrap clearfix" onClick={onClickCb}>
                <div className="row">
                    {delBox}
                    {editBox}
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
                        <div className="description" dangerouslySetInnerHTML={{__html: prodDesc}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="product-info smart-form text-center">
                            {button}
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
