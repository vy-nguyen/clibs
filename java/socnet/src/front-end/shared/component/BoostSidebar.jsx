/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import Nav             from 'bootstrap-lib/Nav.js';
import NavItem         from 'bootstrap-lib/NavItem.js';

import BusinessStore   from 'vntd-root/stores/BusinessStore.jsx';
import BoostNavbar     from 'vntd-shared/component/BoostNavbar.jsx';

class BoostSidebar extends BoostNavbar
{
    constructor(props) {
        super(props);
        this.styles = [
            "navbar navbar-inverse",
            "navbar navbar-default"
        ];
        this.eventKey = "nav.";
        this.state = {
            activeKey: this.eventKey + "0"
        };
    }

    _onSelect(item, evtKey) {
        this.setState({
            activeKey: evtKey
        });
    }

    _renderItem(item, eventKey, level, seq, render) {
        let style  = this.styles[level % this.styles.length],
            seqKey = eventKey + seq,
            active = false,
            subSeq = 0;

        if (seqKey === this.state.activeKey) {
            active = true;
        }
        render.push(
            <NavItem eventKey={seqKey} key={_.uniqueId()} className={style}
                active={active} onSelect={this._onSelect.bind(this, item)}>
                {item.title}
            </NavItem>
        );
        if (item.items != null) {
            eventKey = seqKey + ".";
            _.forEach(item.items, function(it) {
                subSeq = this._renderItem(it, eventKey, level + 1, subSeq, render);
            }.bind(this));
        }
        return seq + 1;
    }

    render() {
        let out = [], eventKey = this.eventKey, seq = 0;

        _.forEach(this.props.sideNav, function(it) {
            seq = this._renderItem(it, eventKey, 0, seq, out);
        }.bind(this));

        return (
            <Nav stacked bsStyle="pills">
                {out}
            </Nav>
        );
    }
}

export default BoostSidebar;
