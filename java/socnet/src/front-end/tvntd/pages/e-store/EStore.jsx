/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _ from 'lodash';
import React, { PropTypes } from 'react-mod'

import StarRating      from 'vntd-shared/layout/StarRating.jsx';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';
import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';
import { EProductStore } from 'vntd-root/stores/ArticleStore.jsx';
import { ProductInfo, ProductBrief } from './ProductInfo.jsx';

import ErrorView from 'vntd-shared/layout/ErrorView.jsx';

let testItems = require('json!../../mock-json/e-store-pview.json');

class EStore extends React.Component
{
    constructor(props) {
        super(props);
        this._renderProdBrief = this._renderProdBrief.bind(this);
        this._renderProdFull = this._renderProdFull.bind(this);
        this._updateState = this._updateState.bind(this);

        this.state = {
            products: EProductStore.getProductsByAuthor(props.userUuid)
        }
        this.state.products = this.state.products.concat(testItems.products);
    }

    componentDidMount() {
        this.unsub = EProductStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(store, data, status, update) {
        let userUuid = this.props.userUuid;
        if (data == null || !_.isEmpty(data) || !Array.isArray(data)) {
            return;
        }
        _.forEach(data, function(prod) {
            if (prod.authorUuid !== userUuid) {
                return;
            }
            this.setState({
                products: EProductStore.getProductsByAuthor(userUuid)
            });
            return false;
        }.bind(this));
    }

    _renderProdBrief(product) {
        return (
            <div className='col-xs-6 col-sm-6 col-md-6 col-lg-4'>
                <ProductBrief product={product} userUuid={this.props.userUuid}/>
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
    products: PropTypes.arrayOf(PropTypes.object)
};

EStore.defaultProps = {
};

 export default EStore;
