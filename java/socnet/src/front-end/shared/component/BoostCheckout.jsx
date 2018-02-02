/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import GlobProps          from 'vntd-shared/actions/PropTypes.jsx';
import InputStore         from 'vntd-shared/stores/NestableStore.jsx';
import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import CartAcct           from 'vntd-shared/actions/Accounting.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';
import BoostProduct       from './BoostProduct.jsx';

const defaultProps = {
    products: {
        "abcdef": {
            articleUuid: "abcdef",
            pictureUrl: [
                "/rs/user/3/fd/26/a623eb25f4481f4ad3a53007e7dc05f4fae1",
            ],
            prodTitle : "Corsair G5600 600 Watt PSU",
            prodSub   : "by Intel",
            prodPrice : "4.75",
            totalOrder: 3,
            status    : "In Stock",
            prodDesc  : "The corsair Gaming Series is the ideal price/performance",
            prodDetail:
`<section className='container product-info'>\
The Corsair Gaming Series GS600 power supply is the ideal price-performance solution for  building or upgrading a Gaming PC. A single +12V rail provides up to 48A of reliable,     continuous power for multi-core gaming PCs with multiple graphics cards. The ultra-quiet, dual ball-bearing fan automatically adjusts its speed according to temperature, so it     will never intrude on your music and games.  Blue LEDs bathe the transparent fan blades   in a cool glow. Not feeling blue? You can turn off the lighting with the press of a       button.\
<h3>Corsair Gaming Series GS600 Features:</h3> \
<li>It supports the latest ATX12V v2.3 standard and is backward compatible with       ATX12V 2.2 and ATX12V 2.01 systems</li> \
<li>An ultra-quiet 140mm double ball-bearing fan delivers great airflow at an very    low noise level by varying fan speed in response to temperature</li> \
<li>80Plus certified to deliver 80% efficiency or higher at normal load conditions    (20% to 100% load)</li> \
<li>0.99 Active Power Factor Correction provides clean and reliable power</li> \
<li>Universal AC input from 90~264V — no more hassle of flipping that tiny red switch to select the voltage input!</li> \
<li>Extra long fully-sleeved cables support full tower chassis</li> \
<li>A three year warranty and lifetime access to Corsair’s legendary technical        support and customer service</li> \
<li>Over Current/Voltage/Power Protection, Under Voltage Protection and Short Circuit Protection provide complete component safety</li> \
<li>Dimensions: 150mm(W) x 86mm(H) x 160mm(L)</li> \
<li>MTBF: 100,000 hours</li> \
<li>Safety Approvals: UL, CUL, CE, CB, FCC Class B, TÜV, CCC, C-tick</li> \
</section>`,
        prodSpec:
`<section className='container product-info'>\
The Corsair Gaming Series GS600 power supply is the ideal price-performance solution for  building or upgrading a Gaming PC. A single +12V rail provides up to 48A of reliable,     continuous power for multi-core gaming PCs with multiple graphics cards. The ultra-quiet, dual ball-bearing fan automatically adjusts its speed according to temperature, so it     will never intrude on your music and games.  Blue LEDs bathe the transparent fan blades   in a cool glow. Not feeling blue? You can turn off the lighting with the press of a       button.\
</section>`
        },
        "abc123": {
            articleUuid: "abc123",
            pictureUrl: [
                "/rs/user/3/fc/61/e87980642f9632c94abf69b1c95ee53c190b",
            ],
            prodTitle : "CPU 586",
            prodSub   : "by AMD",
            prodPrice : "454.75",
            totalOrder: 30,
            status    : "In Stock"
        }
    }
};

class BoostCheckout extends ComponentBase
{
    constructor(props) {
        super(props, null, InputStore);
        this.iconStyle = {
            width : "72px",
            height: "72px"
        };
        this.tabFmt = [
            "col-xs-6 col-sm-6 col-md-6 col-lg-6",
            "col-xs-1 col-sm-1 col-md-1 col-lg-1",
            "col-xs-2 col-sm-2 col-md-2 col-lg-2 text-right",
            "col-xs-2 col-sm-2 col-md-2 col-lg-2 text-right",
            "col-xs-1 col-sm-1 col-md-1 col-lg-1"
        ];
        this._fillInDefault(props);
        this.state = this._getState(InputStore, props);
    }

    _fillInDefault(props) {
        InputStore.storeItemIndex(props.id, defaultProps, false);
    }

    _getState(store, props) {
        if (props == null) {
            props = this.props;
        }
        return InputStore.getItemIndex(props.id);
    }

    _productClick(row) {
        this.refs[row.articleUuid].openModal();
    }

    _productInfo(row) {
        let icon = row.pictureUrl[0],
            onClick = this._productClick.bind(this, row);

        return (
            <div className="media">
                <a className="thumbnail pull-left" onClick={onClick}>
                    <img className="media-object" src={icon} style={this.iconStyle}/>
                </a>
                <div className="media-body padding-5">
                    <h4 className="media-heading">
                        <a onClick={onClick}>{row.prodTitle}</a>
                    </h4>
                    <h5 className="media-heading"> {row.prodSub}</h5>
                    <span>Status: </span>
                    <span className="text-success">
                        <strong>{row.status}</strong>
                    </span>
                </div>
                <BoostProduct product={row} modal={true}
                    disable={true} ref={row.articleUuid}/>
            </div>
        );
    }

    _changeItem(row, evt) {
        let products = this.state.products;
        row.totalOrder = evt.target.value;

        products[row.articleUuid] = row;
        this.setState(products);
    }

    _removeItem(row) {
        let products = this.state.products;
        delete products[row.articleUuid];
        this.setState(products);
        InputStore.dumpData("store");
    }

    _renderOneRow(row, sum) {
        let price = parseFloat(row.prodPrice),
            total = sum.updateItem(price, row.totalOrder);

        return (
            <tr>
                <td className={this.tabFmt[0]}>
                    <div className="media">
                        {this._productInfo(row)}
                    </div>
                </td>
                <td className={this.tabFmt[1]}>
                    <input type="email" className="form-control"
                        onChange={this._changeItem.bind(this, row)}
                        value={row.totalOrder}/>
                </td>
                <td className={this.tabFmt[2]}><strong>${price}</strong></td>
                <td className={this.tabFmt[3]}><strong>${total}</strong></td>
                <td className={this.tabFmt[4]}>
                    <button type="button" className="btn btn-danger"
                        onClick={this._removeItem.bind(this, row)}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                </td>
            </tr>
        );
    }

    _renderRow(rows, sum) {
        let out = [];

        _.forOwn(rows, function(prod) {
            out.push(this._renderOneRow(prod, sum));
        }.bind(this));

        sum.compute();
        return out;
    }

    _renderSumRow(header, price, big) {
        let headerOut, priceOut;

        if (big === true) {
            headerOut = <h3>{header}</h3>;
            priceOut  = <h3><strong>${price}</strong></h3>;
        } else {
            headerOut = <h5>{header}</h5>;
            priceOut  = <h5><strong>${price}</strong></h5>;
        }
        return (
            <tr>
                <td className={this.tabFmt[0]}> </td>
                <td className={this.tabFmt[2]} colSpan="2">{headerOut}</td>
                <td className={this.tabFmt[3]}>{priceOut}</td>
                <td className={this.tabFmt[4]}> </td>
            </tr>
        );
    }

    _checkout(sum) {
        console.log("checkout cart");
        console.log(sum);
    }

    render() {
        let sum = new CartAcct();
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className={this.tabFmt[0]}>Product</th>
                        <th className={this.tabFmt[1]}>Quantity</th>
                        <th className={this.tabFmt[2]}>Price</th>
                        <th className={this.tabFmt[3]}>Total</th>
                        <th className={this.tabFmt[4]}> </th>
                    </tr>
                </thead>
                <tbody>
                    {this._renderRow(this.state.products, sum)}
                    {this._renderSumRow("Subtotal", sum.getSubTotal(), false)}
                    {this._renderSumRow("Estimated shipping", sum.getShipping(), false)}
                    {this._renderSumRow("Estimated tax", sum.getTax(), false)}
                    {this._renderSumRow("Total", sum.getTotal(), true)}
                    <tr>
                        <td> </td>
                        <td colSpan="2">
                            <button type="button" className="btn btn-default">
                                <span className="glyphicon glyphicon-shopping-cart">
                                </span> Continue Shopping
                            </button>
                        </td>
                        <td>
                            <button type="button" className="btn btn-success"
                                onClick={this._checkout.bind(this, sum)}>
                                Checkout <span className="glyphicon glyphicon-play"/>
                            </button>
                        </td>
                        <td> </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

BoostCheckout.defaultProps = defaultProps;
BoostCheckout.propTypes = {
    products: PropTypes.arrayOf(GlobProps.product).isRequired
};

export default BoostCheckout;
