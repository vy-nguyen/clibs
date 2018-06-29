/**
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import KeyValueTable    from 'vntd-shared/layout/KeyValueTable.jsx';
import SmallBreadcrumbs from 'vntd-shared/layout/SmallBreadcrumbs.jsx';

import { ColFmtMap }    from 'vntd-root/config/constants.js';
import EtherStore       from 'vntd-root/stores/EtherStore.jsx';

class EtherBaseAcct extends React.Component
{
    constructor(props) {
        super(props);
        this._currentState  = this._currentState.bind(this);
        this._updateEthAcct = this._updateEthAcct.bind(this);

        this.state = _.merge(this.state, this._currentState());
    }

    componentDidMount() {
        this.unsub = EtherStore.listen(this._updateEthAcct);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateEthAcct(store, data) {
        this.setState(this._currentState());
    }

    _currentState() {
        return {
            community: EtherStore.getCommunity(),
            reserved : EtherStore.getReserved()
        };
    }

    render() {
        let text = null, item = null;

        if (this.props.item === "community") {
            item = this.state.community;
            text = "Community";
        } else {
            item = this.state.reserved;
            text = "Reserved";
        }
        if (item != null) {
            let acct = [{
                key: text,
                val: item.getMoneyBalance()
            }];
            return <KeyValueTable keyValueList={acct}/>;
        }
        return null;
    }
}

class EtherCrumbs extends SmallBreadcrumbs
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className={ColFmtMap[5]}>
                    {this.mainRender()}
                </div>
                <div className={ColFmtMap[4]}>
                    <EtherBaseAcct item="community"/>
                </div>
                <div className={ColFmtMap[4]}>
                    <EtherBaseAcct item="reserved"/>
                </div>
            </div>
        );
    }
}

export default EtherCrumbs;
export { EtherBaseAcct }
