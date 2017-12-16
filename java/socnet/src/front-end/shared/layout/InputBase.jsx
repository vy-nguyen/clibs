/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import SmallBreadcrumbs    from 'vntd-shared/layout/SmallBreadcrumbs.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';

class InputBase extends React.Component
{
    constructor(props, id, stores) {
        super(props);

        this.id = id || props.id;
        this._listStores = stores;
    }

    componentDidMount() {
        let stores = this._listStores;

        this.unsub = [];
        if (!Array.isArray(stores)) {
            stores = [this._listStores];
        }
        _.forEach(stores, function(st) {
            this.unsub.push(st.listen(this._updateState.bind(this, st))); 
        }.bind(this));
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            _.forEach(this.unsub, function(unsub) {
                unsub();
            });
            this.unsub = null;
        }
    }

    _updateState(store, data, item, code) {
        console.log("base update...");
    }

    _renderForm() {
        return null;
    }

    render() {
        let content = (
            <JarvisWidget id={this.id} color="purple">
                <header>
                    <span className="widget-icon"><i className="fa fa-pencil"/></span>
                    <h2>{this.title}</h2>
                </header>
                <div className="widget-body">
                    {this._renderForm()}
                </div>
            </JarvisWidget>
        );
        if (this.crumbRoute != null && this.crumbLabel != null) {
            return (
                <div id={this.id || _.uniqueId()}>
                    <SmallBreadcrumbs id="route-map"
                        crumb={this.crumbLabel} route={this.crumbRoute}/>
                    {content}
                </div>
            );
        }
        return content;
    }
}

export default InputBase;
