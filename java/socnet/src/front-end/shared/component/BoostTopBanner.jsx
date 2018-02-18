/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import {Link}         from 'react-router';

import ComponentBase  from 'vntd-shared/layout/ComponentBase.jsx';
import BusinessStore  from 'vntd-root/stores/BusinessStore.jsx';
import {HeaderSearch} from 'vntd-root/pages/layout/Header.jsx';

class CartWidget extends React.Component
{
    render() {
        return (
            <div className="header-cart">
                <Link to="/account/cart">
                    <i className="fa fa-lg fa-shopping-cart"/>
                    <b>My Cart <span className="badge">0</span></b>
                </Link>
            </div>
        );
    }
}

class BoostTopBanner extends ComponentBase
{
    constructor(props) {
        super(props, null, [BusinessStore]);
        this.state = this._updateTopBanner();
    }

    _updateState(store, data, item, code) {
        this.setState(this._updateTopBanner());
    }

    _updateTopBanner() {
        return BusinessStore.getTopBanner();
    }

    _renderLogoText(logoText) {
        return (
            <span key={_.uniqueId()} style={logoText.format}>
                {logoText.title}
            </span>
        );
    }

    render() {
        let logoText, slogan, image, out = [],
            { logo, items } = this.state;

        if (logo == null) {
            return null;
        }
        image    = logo.image;
        slogan   = logo.slogan;
        logoText = logo.logoText.map(function(text) {
            return this._renderLogoText(text);
        }.bind(this));

        _.forEach(items, function(it) {
            switch(it.widget) {
                case 'Search':
                    out.push(<HeaderSearch/>);
                    break;

                case 'Cart':
                    out.push(<CartWidget/>);
                    break;
                default:
            }
        });
        return (
            <div className="container">
                <div style={this.state.format}>
                    <Link to="/">
                        <img style={image.format} src={image.url}/>
                        <div style={logo.format}>
                            {logoText}
                            <span style={slogan.format}>{slogan.title}</span>
                        </div>
                    </Link>
                </div>
                {out}
            </div>
        );
    }
}

export default BoostTopBanner;
