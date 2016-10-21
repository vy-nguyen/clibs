/**
 * Created by griga on 11/30/15.
 */
import React from 'react-mod'

class MinifyMenu extends React.Component
{
    constructor(props) {
        super(props);
        this._toggle = this._toggle.bind(this);
    }

    _toggle() {
        let $ = require('jquery');
        let body = $('body');

        if (!body.hasClass("menu-on-top")) {
            body.toggleClass("minified");
            body.removeClass("hidden-menu");
            $('html').removeClass("hidden-menu-mobile-lock");
        }
    }

    componentDidMount() {
        this._toggle();
    }

    render() {
        return (
            <span className="minifyme" data-action="minifyMenu" onClick={this._toggle}>
               <i className="fa fa-arrow-circle-left hit"/>
           </span>
        )
    }
}

export default MinifyMenu
