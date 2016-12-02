/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _ from 'lodash';
import React, { PropTypes } from 'react-mod'

import LikeStat        from 'vntd-root/components/LikeStat.jsx';
import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';
import StarRating      from 'vntd-shared/layout/StarRating.jsx';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';
import { ProductInfo, ProductBrief } from './ProductInfo.jsx';

let testItems = require('json!../../mock-json/e-store-pview.json');

class EStore extends React.Component
{
    constructor(props) {
        super(props);
        this._renderProdBrief = this._renderProdBrief.bind(this);
        this._renderProdFull = this._renderProdFull.bind(this);

        _.forEach(testItems.products, function(it) {
            if (_.isEmpty(it.brief.productDesc)) {
                it.brief.productDesc = it.detail.productDesc;
            }
        });
        this.state = testItems;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _renderProdBrief(product) {
        return (
            <div className='col-xs-6 col-sm-6 col-md-6 col-lg-4'>
                <ProductBrief product={product.brief}/>
            </div>
        );
    }

    _renderProdFull(product) {
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            </div>
        );
    }

    render() {
        const products = this.state.products;
        return (
            <div id="content">
                <section id="widget-grid" className="">
                    {ArticleTagBrief.renderArtBox(products, this._renderProdBrief, this._renderProdFull)}
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <button className="btn btn-primary btn-lg">
                                Load more <i className="fa fa-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

EStore.propTypes = {
};

EStore.defaultProps = {
};

 export default EStore;
