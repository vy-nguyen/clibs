import React from 'react-mod'

class ToggleMenu extends React.Component
{
    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu(e) {
        var $ = require('jquery');
		var $body = $('body'), $html = $('html');

        if (!$body.hasClass("menu-on-top")){
            $html.toggleClass("hidden-menu-mobile-lock");
            $body.toggleClass("hidden-menu");
            $body.removeClass("minified");
        } else if ($body.hasClass("menu-on-top") && $body.hasClass("mobile-view-activated")) {
            $html.toggleClass("hidden-menu-mobile-lock");
            $body.toggleClass("hidden-menu");
            $body.removeClass("minified");
        }
        e.preventDefault();
    }

	render() {
		return (
            <div id="hide-menu" className={this.props.className}>
                <span>
                    <a href-void onClick={this.toggleMenu} title="Collapse Menu"><i className="fa fa-reorder"/></a>
                </span>
            </div>
		)
	}
}

export default ToggleMenu
