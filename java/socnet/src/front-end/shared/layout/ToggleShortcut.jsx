/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import $     from 'jquery';
import React from 'react';

class ToggleShortcut extends React.Component
{
    constructor(props) {
        super(props);
        this._showShortcut   = this._showShortcut.bind(this);
        this._hideShortcut   = this._hideShortcut.bind(this);
        this._toggleShortcut = this._toggleShortcut.bind(this);
    }

    _hideShortcut() {
        this._shortcut.hide();
        $('body').removeClass('shortcut-on');
        $(document).off('mouseup.smartShortcut');
        this._shortcut.off('click.smartShortcut', 'a');
    }

    _showShortcut() {
        this._shortcut.show();
        $('body').addClass('shortcut-on');

        $(document).on('mouseup.smartShortcut', function(mue) {
            if (this._shortcut && !this._shortcut.is(mue.target) &&
                this._shortcut.has(mue.target).length === 0) {
                this._hideShortcut();
            }
        }.bind(this));

        this._shortcut.on('click.smartShortcut', 'a', function(ce) {
            setTimeout(this._hideShortcut, 300);
        }.bind(this));
    }

    _toggleShortcut(e) {
        e.preventDefault();
        this._shortcut = $('#shortcut');
        this._sideMenu = $('#left-panel');

        this._sideMenu.hide();
        if (this._shortcut.is(":visible")) {
            this._hideShortcut();
        } else {
            this._showShortcut();
        }
    }

    render() {
        return (
            <a href-void onClick={this._toggleShortcut}>{this.props.children}</a>
        );
	}
}

export default ToggleShortcut;
