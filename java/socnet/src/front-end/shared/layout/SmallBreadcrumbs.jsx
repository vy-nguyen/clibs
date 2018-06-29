/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import { Link }        from 'react-router';
import { BoundArray }  from 'vntd-shared/utils/Enum.jsx';
import InputStore      from 'vntd-shared/stores/NestableStore.jsx';

class SmallBreadcrumbs extends React.Component
{
    constructor(props) {
        let crumbs;

        super(props);
        this._addCrumb = this._addCrumb.bind(this);

        this.state = {
            crumbs: this._createStore(props)
        };
    }

    componentWillReceiveProps(nextProps) {
        this._addCrumb(nextProps);
    }

    _createStore(props) {
        let crumbs = InputStore.getItemIndex(props.id);

        if (crumbs == null) {
            crumbs = new BoundArray(5);
            InputStore.storeItemIndex(props.id, crumbs);
        }
        crumbs.push(props.crumb, props.route);
        return crumbs;
    }

    _addCrumb(props) {
        this.setState({
            crumbs: this._createStore(props)
        });
    }

    mainRender() {
        let out = null, data = this.state.crumbs.getData();

        out = data.map(function(elm) {
            return (
                <li key={_.uniqueId('bc-')}>
                    <Link to={elm.elm}>
                        {elm.key}
                    </Link>
                </li>
            );
        }.bind(this));

        return (
            <ol className="breadcrumb">
                <li><Link to="/app"><i className="fa fa-home fa-2x"/></Link></li>
                {out}
            </ol>
        );
    }

    render() {
        return this.mainRender();
    }
}

export default SmallBreadcrumbs;
