/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import Nav             from 'bootstrap-lib/Nav.js';
import NavItem         from 'bootstrap-lib/NavItem.js';

import History         from 'vntd-shared/utils/History.jsx';
import BoostNavbar     from 'vntd-shared/component/BoostNavbar.jsx';
import BusinessStore   from 'vntd-root/stores/BusinessStore.jsx';

class BoostSidebar extends BoostNavbar
{
    constructor(props) {
        super(props);
        this.styles = [
            "nav",
            "nav navbar-default"
        ];
        this.eventKey = "nav.";
        this.state = {
            activeKey: null
        };
    }

    _onSelect(item, evtKey) {
        this.setState({
            activeKey: evtKey
        });
        History.pushState(null, item.route);
    }

    _renderItem(item, eventKey, level, seq, render, sideFormat) {
        let classn = this.styles[level % this.styles.length],
            active = false, disable = false,
            seqKey = eventKey + seq,
            subSeq = 0,
            style  = {},
            title  = item.title;

        if (seqKey === this.state.activeKey) {
            active = true;
            title  = ">> " + title;
        }
        if (item.route == null) {
            disable = true;
            style   = sideFormat.inactive;
        }
        render.push(
            <NavItem eventKey={seqKey} key={_.uniqueId()} className={classn}
                style={style} active={active} disabled={disable}
                onSelect={this._onSelect.bind(this, item)}>
                {title}
            </NavItem>
        );
        if (item.items != null) {
            eventKey = seqKey + ".";
            _.forEach(item.items, function(it) {
                subSeq = this._renderItem(
                    it, eventKey, level + 1, subSeq, render, sideFormat
                );
            }.bind(this));
        }
        return seq + 1;
    }

    render() {
        let sec, out = [], eventKey = this.eventKey, seq = 0,
            { sideNav, sideFormat } = this.props;

        _.forEach(sideNav, function(it) {
            sec = [];
            seq = this._renderItem(it, eventKey, 0, seq, sec, sideFormat);
            out.push(
                <Nav stacked style={sideFormat.nav} bsStyle="pills">
                    {sec}
                </Nav>
            );
            out.push(<br/>);
        }.bind(this));

        return (
            <div className="well">
                {out}
            </div>
        );
    }
}

export default BoostSidebar;
