/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';

class BigBreadcrumbs extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            items: props.items || [],
            icon : props.icon || "fa fa-fw fa-home"
        };
        this._addCrumb = this._addCrumb.bind(this);
        this._onNavigationChange = this._onNavigationChange.bind(this);
    }

    componentWillMount() {
        let item = NavigationStore.getData().item;
        if (!this.props.items && item) {
            this._onNavigationChange({
                item: item
            })
        }
    }

    componentDidMount() {
        this.unsub = NavigationStore.listen(this._onNavigationChange);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _onNavigationChange(data) {
        let item = data.item;
        let result = {
            icon    : '',
            itemList: []
        };
        this._addCrumb(item, result);
        this.setState({
            icon : result.icon,
            items: result.itemList
        });
    }

    _addCrumb(item, result) {
        result.itemList.unshift(item.title);
        if (result.icon != null && item.icon) {
            result.icon = item.icon;
        }
        if (item.parent) {
            this._addCrumb(item.parent, result);
        }
    }

    render() {
        let first = _.head(this.state.items),
        child = _.tail(this.state.items).map(function(item) {
            return (
                <span key={_.uniqueId('big-breadcrumb-')}>
                    <span className="page-title-separator">&gt;</span>
                    {item}
                </span>
            );
        });
        return (
            <div className={this.props.className + ' big-breadcrumbs'}>
                <h2 className="page-title txt-color-blueDark">
                    <i className={this.state.icon}/>{' ' + first}{child}
                </h2>
            </div>
        )
    }
}

export default BigBreadcrumbs;
