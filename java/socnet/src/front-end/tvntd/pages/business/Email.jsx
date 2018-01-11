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

class Email extends InputBase
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
                        <div className="col col-sm-9 col-xs-6">
                            <h1>Products</h1>
                            <div className="row">
                                <div className="col col-xs-12 col-md-6 col-lg-4 item">
                                    <div className='img-container'>
                                        <img src="http://lorempixel.com/250/250/food/1"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/2"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/3"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/4"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/2"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/1"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/4"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/5"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/3"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/2"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/4"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/1"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/6"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/3"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-4 item">
                <div className='img-container'>
                    <img src="http://lorempixel.com/250/250/food/5"/>
            </div>
            <h2>Product Name</h2>
            <p>Product Name</p>
            <p>$10.99</p>
            </div>

            </div>
            </div>
            <div className="col col-sm-3 col-xs-6">
                <div id = 'cart-container' data-spy="affix" data-offset-top="10">
                    <h1>Shopping Cart <span className="badge" id='cartItems'></span></h1>
                    <div className="cart" id = 'cart'>
                        So lonely here, add something
                    </div>
            <div id = 'prices'></div>
            </div>
            </div>
            </div>
            </div>
            </div>
        );
    }
}

export default Email;
