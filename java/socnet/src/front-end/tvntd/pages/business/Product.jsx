/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class Product extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <h2>Ecommerce Products Display Layout</h2>
                        <p>
                            This snippent uses <a href="http://daneden.github.io/animate.css/" target="_blank">Animate.css</a> for the animation of the buttons.
                        </p>
                        <div className="col-sm-3">
                            <article className="col-item">
                                <div className="photo">
                                    <div className="options-cart-round">
                                        <button className="btn btn-default" title="Add to cart">
                                            <span className="fa fa-shopping-cart"></span>
                                        </button>
                                    </div>
            <a href="#"> <img src="https://unsplash.it/500/300?image=0" className="img-responsive" alt="Product Image" /> </a>
            </div>
            <div className="info">
                <div className="row">
                    <div className="price-details col-md-6">
                        <p className="details">
                            Lorem ipsum dolor sit amet, consectetur..
                        </p>
                        <h1>Sample Product</h1>
                        <span className="price-new">$110.00</span>
                    </div>
            </div>
            </div>
            </article>
            <p className="text-center">Hover over image</p>
            </div>
            <div className="col-sm-3">
                <article className="col-item">
                    <div className="photo">
                        <div className="options">
                            <button className="btn btn-default" type="submit" data-toggle="tooltip" data-placement="top" title="Add to wish list">
                                <i className="fa fa-heart"></i>
                            </button>
                            <button className="btn btn-default" type="submit" data-toggle="tooltip" data-placement="top" title="Compare">
                                <i className="fa fa-exchange"></i>
                            </button>
                        </div>
            <div className="options-cart">
                <button className="btn btn-default" title="Add to cart">
                    <span className="fa fa-shopping-cart"></span>
                </button>
            </div>
            <a href="#"> <img src="https://unsplash.it/500/300?image=0" className="img-responsive" alt="Product Image" /> </a>
            </div>
            <div className="info">
                <div className="row">
                    <div className="price-details col-md-6">
                        <p className="details">
                            Lorem ipsum dolor sit amet, consectetur..
                        </p>
                        <h1>Sample Product</h1>
                        <span className="price-new">$110.00</span>
                    </div>
            </div>
            </div>
            </article>
            <p className="text-center">Hover over image</p>
            </div>
            <div className="col-sm-3">
                <article className="col-item">
                    <div className="options">
                        <button className="btn btn-default" type="submit" data-toggle="tooltip" data-placement="top" title="Add to wish list">
                            <i className="fa fa-heart"></i>
                        </button>
                        <button className="btn btn-default" type="submit" data-toggle="tooltip" data-placement="top" title="Compare">
                            <i className="fa fa-exchange"></i>
                        </button>
                    </div>
            <div className="photo">
                <a href="#"> <img src="https://unsplash.it/500/300?image=0" className="img-responsive" alt="Product Image" /> </a>
            </div>
            <div className="info">
                <div className="row">
                    <div className="price-details col-md-6">
                        <p className="details">
                            Lorem ipsum dolor sit amet, consectetur..
                        </p>
                        <h1>Sample Product</h1>
                        <span className="price-new">$110.00</span>
                    </div>
            </div>
            </div>
            </article>
            </div>
            <div className="col-sm-3">
                <article className="col-item">
                    <div className="photo">
                        <a href="#"> <img src="https://unsplash.it/500/300?image=0" className="img-responsive" alt="Product Image" /> </a>
            </div>
            <div className="info">
                <div className="row">
                    <div className="price-details col-md-6">
                        <p className="details">
                            Lorem ipsum dolor sit amet, consectetur..
                        </p>
                        <h1>Sample Product</h1>
                        <span className="price-new">$110.00</span>
                    </div>
            </div>
            <div className="separator clear-left">
                <p className="btn-add">
                    <i className="fa fa-shopping-cart"></i><a href="#" className="hidden-sm">Add to cart</a>
                </p>
                <p className="btn-details">
                    <a href="#" className="hidden-sm" data-toggle="tooltip" data-placement="top" title="Add to wish list"><i className="fa fa-heart"></i></a>
                    <a href="#" className="hidden-sm" data-toggle="tooltip" data-placement="top" title="Compare"><i className="fa fa-exchange"></i></a>
                </p>
            </div>
            <div className="clearfix"></div>
            </div>
            </article>
            </div>
            </div>
            </div>
            </div>
        );
    }
}

export default Product;
