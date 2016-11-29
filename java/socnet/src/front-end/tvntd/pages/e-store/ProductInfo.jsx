/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import React from 'react-mod'

import TabPanel         from 'vntd-shared/layout/TabPanel.jsx';
import StarRating       from 'vntd-shared/layout/StarRating.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import PostComment      from 'vntd-root/components/PostComment.jsx';

    /*
class StarRating extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <span>
                    <i className="fa fa-star fa-2x text-primary"></i>
                    <i className="fa fa-star fa-2x text-primary"></i>
                    <i className="fa fa-star fa-2x text-primary"></i>
                    <i className="fa fa-star fa-2x text-primary"></i>
                    <i className="fa fa-star fa-2x text-muted"></i>
                </span>
                <span className="fa fa-2x">
                    <h5>  (109) Votes</h5>
                </span>
                <a href="javascript:void(0);"> 109 customer reviews</a>
            </div>
        );
    }
}
     */
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

    _productImages(uuid) {
        let itemId = 'product-img-' + uuid;
        let itemRef = '#' + itemId;

        return (
            <div className="product-image">
                <div id={itemId} className="carousel slide">
                    <ol className="carousel-indicators">
                        <li data-target={itemRef} data-slide-to="0" className=""></li>
                        <li data-target={itemRef} data-slide-to="1" className="active"></li>
                        <li data-target={itemRef} data-slide-to="2" className=""></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="item active">
                            <img src="/rs/img/demo/e-comm/detail-1.png" alt=""/>
                        </div>
                        <div className="item">
                            <img src="/rs/img/demo/e-comm/detail-2.png" alt=""/>
                        </div>
                        <div className="item">
                            <img src="/rs/img/demo/e-comm/detail-3.png" alt=""/>
                        </div>
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

    _getProductTabs(props) {
        return {
            containerFmt: 'description description-tabs',
            headerFmt   : 'nav nav-pills',
            contentFmt  : 'tab-content',
            tabItems: [ {
                domId  : 'prod-tab-desc-' + props.uuid,
                tabText: 'Product Description',
                paneFmt: 'fade in',
                tabIdx : 0
            }, {
                domId  : 'prod-tab-spec-' + props.uuid,
                tabText: 'Specifications',
                paneFmt: 'fade',
                tabIdx : 1
            }, {
                domId  : 'prod-tab-review-' + props.uuid,
                tabText: 'Reviews',
                paneFmt: 'fade in',
                tabIdx : 2
            } ]
        };
    }

    _productDesc(props) {
        let tabData = this._getProductTabs(props);
        let prodDesc = (
            <div>
                <strong>{props.productTitle}</strong>
                {props.productDesc}
            </div>
        );
        let prodSpec = (
            <div>
                {props.productSpec}
            </div>
        );
        return (
            <TabPanel context={tabData}>
                {prodDesc}
                {prodSpec}
                <PostComment articleUuid={props.uuid}/>
            </TabPanel>
        );
    }

    _renderProduct() {
        let prodDesc = (
            <div>
                <strong>Product ABC</strong>
                <p>Integer egestas, orci id condimentum eleifend, nibh nisi pulvinar eros, vitae ornare massa  neque ut orci. Nam aliquet lectus sed odio eleifend, at iaculis dolor egestas. Nunc elementum pellentesque augue sodales porta. Etiam  aliquet rutrum turpis, feugiat sodales ipsum consectetur nec.</p>
            </div>
        );
        let prodSpec = (
            <div>
                <dl className="">
                    <dt>Gravina</dt>
                    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
                    <dd>Eget lacinia odio sem nec elit.</dd>
                    <br/>
                    <dt>Test lists</dt>
                    <dd>A description list is perfect for defining terms.</dd>
                    <br/>
                    <dt>Altra porta</dt>
                    <dd>Vestibulum id ligula porta felis euismod semper</dd>
                </dl>
            </div>
        );
        let props = {
            uuid   : "1234",
            price  : "$100",
            priceNotice : "includes tax",
            productTitle: "Item abc",
            productDesc : prodDesc,
            productSpec : prodSpec,
        };
        let prodTab = this._productDesc(props);
        return (
            <div className="product-content product-wrap clearfix product-deatil">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        {this._productImages(props.uuid)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <h2 className="name">
                                    {props.productTitle}
                                    <small>Product by <a href="javascript:void(0);">Adeline</a></small>
                                </h2>
                                <StarRating name={props.uuid} value={7} editing={false}/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <h3 className="price-container">
                                    {props.price}
                                    <small>{props.priceNotice}</small>
                                </h3>
                            </div>
                        </div>
                        <hr/>
                        <div className="certified">
                            <ul>
                                <li><a href="javascript:void(0);">Delivery time<span>7 Working Days</span></a></li>
                                <li><a href="javascript:void(0);">Certified<span>Quality Assured</span></a></li>
                            </ul>
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
                        <a href="javascript:void(0);" className="btn btn-success btn-lg">Add to cart {props.price}</a>
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
        let product = this._renderProduct();

        if (this.props.modal === true) {
            return (
                <ModalConfirm ref={'modal'} modalTitle={"Product"}>
                    {product}
                </ModalConfirm>
            );
        }
        return {product};
    }
}

export default ProductInfo;
