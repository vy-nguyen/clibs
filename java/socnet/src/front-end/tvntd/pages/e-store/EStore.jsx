/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _ from 'lodash';
import React, { PropTypes } from 'react-mod'

import StarRating        from 'vntd-shared/layout/StarRating.jsx';
import ProductBase       from 'vntd-shared/layout/ProductBase.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import LikeStat          from 'vntd-root/components/LikeStat.jsx';
import ArticleTagBrief   from 'vntd-root/components/ArticleTagBrief.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import { ProductInfo, ProductBrief } from './ProductInfo.jsx';

import ErrorView from 'vntd-shared/layout/ErrorView.jsx';

class EStore extends ProductBase
{
    constructor(props) {
        super(props);
    }

    static _renderProdBrief(userUuid, product) {
        return (
            <ProductBrief product={product} userUuid={userUuid}/>
        );
    }

    static _renderProdFull(product) {
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            </div>
        );
    }

    static renderProducts(products, userUuid) {
        let renderBrief = EStore._renderProdBrief.bind(this, userUuid);

        return (
            <div id="content">
                <section id="widget-grid" className="">
                    {ArticleTagBrief.renderArtBox(products,
                        renderBrief, EStore._renderProdFull, false)}
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <button className="btn btn-primary btn-lg">
                                <Mesg text="Load more "/>
                                 <i className="fa fa-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    render() {
        return EStore.renderProducts(this.state.products, this.props.userUuid);
    }
}

EStore.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object)
};

EStore.defaultProps = {
};

export default EStore;
