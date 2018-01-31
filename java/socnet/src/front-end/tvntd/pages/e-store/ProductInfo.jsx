/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _                from 'lodash';
import React            from 'react-mod';
import PropTypes        from 'prop-types';
import StarRating       from 'react-star-rating';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import TabPanel         from 'vntd-shared/layout/TabPanel.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import LikeStat         from 'vntd-root/components/LikeStat.jsx';
import PostComment      from 'vntd-root/components/PostComment.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import {
    BoostProdImage, BoostProdTab, BoostProdShopBtn
} from 'vntd-shared/component/BoostProduct.jsx';

class ProductInfo extends React.Component
{
    constructor(props) {
        super(props);
    }

    openModal() {
        this.refs.modal.openModal();
    }

    _renderProduct() {
        let prodRank = this.props.product,
            prod = prodRank.getArticle(), productTags = [];

        if (prod == null) {
            console.log("not found product");
            return null;
        }
        if (prod.prodTags != null) {
            let tagLength = prod.prodTags.length;
            for (let i = 0; i < tagLength; i++) {
                productTags.push(
                    <li key={_.uniqueId('prod-info-')}>
                        <div dangerouslySetInnerHTML={{__html: prod.prodTags[i]}}/>
                    </li>
                );
            }
        }
        return (
            <div className="product-content product-wrap clearfix product-deatil">
                <div className="row">
                    <BoostProdImage articleUuid={prod.articleUuid}
                            images={prod.pictureUrl}/>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <h2 className="name">
                            {prod.prodTitle}
                            <div dangerouslySetInnerHTML={{__html: prod.prodSub}}/>
                        </h2>
                        <StarRating size={15} totalStars={5} rating={4} disabled={true}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h3 className="price-container">
                            {prod.prodPrice}
                            <small>{prod.priceNotice}</small>
                        </h3>
                    </div>
                </div>
                <hr/>
                <div className="certified">
                    <ul>{productTags}</ul>
                </div>
                <div className="row">
                    <BoostProdTab product={prod}/>
                </div>
                <BoostProdShopBtn articleUuid={prod.articleUuid}/>
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

        this._getDetail   = this._getDetail.bind(this);
        this._clickSelect = this._clickSelect.bind(this);

        this.addCart     = this.addCart.bind(this);
        this.addWish     = this.addWish.bind(this);
        this.mailSeller  = this.mailSeller.bind(this);
        this.confirmDel  = this.confirmDel.bind(this);
    }

    addCart() {
        console.log("override add to cart...");
    }

    addWish() {
    }

    mailSeller() {
    }

    confirmDel(product) {
        Actions.deleteProduct({
            authorUuid: UserStore.getSelfUuid(),
            uuidType  : "product",
            uuids     : [ this.props.product.articleUuid ]
        });
    }

    _getDetail() {
    }

    _clickSelect() {
        this.refs.modal.openModal();
    }

    render() {
        let logoTag, onClickCb = this.props.onClickCb,
            prodRank = this.props.product, prod = prodRank.getArticle();

        if (onClickCb == null) {
            onClickCb = this._clickSelect;
        }
        if (prod.logoTag != null) {
            logoTag = <span className='tag2 hot'>{prod.logoTag}</span>;
        } else {
            logoTag = null;
        }
        return (
            <div className="items">
                <ProductInfo ref="modal" modal={true} product={prodRank}/>
                <div className="item" onClick={onClickCb}>
                    <img src={prod.logoImg} className="img-responsive"/>
                    {logoTag}
                    <div className="info">
                        <h3>{prod.prodName}
                            <b className="pull-right">${prod.prodPrice}</b>
                        </h3>
                        <h5>{prod.prodCat}</h5>
                        <p className="description"
                            dangerouslySetInnerHTML={{__html: prod.prodDesc}}/>
                    </div>
                    <LikeStat data={prod.likeStat} split={true}/>
                    <StarRating size={15} totalStars={5} rating={4} disabled={true}/>
                </div>
                <br/>
                <BoostProdShopBtn articleUuid={prod.articleUuid} cartOnly={true}
                    product={prod} userUuid={this.props.userUuid}
                    addCart={this.addCart} addWish={this.addWish}
                    mailSeller={this.mailSeller} confirmDel={this.confirmDel}
                />
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
