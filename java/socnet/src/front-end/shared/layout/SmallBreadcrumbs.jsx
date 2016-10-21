/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import NavigationStore from 'vntd-shared/stores/NavigationStore';

class SmallBreadcrumbs extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items || []
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
        let result = [];

        if (item.route) {
            this._addCrumb(item, result);
            this.setState({
                items: result
            });
        }
    }

    _addCrumb(item, result) {
        result.unshift(item.title)
        if (item.parent) {
            this._addCrumb(item.parent, result)
        }
    }

    render() {
        return (
            <ol className="breadcrumb">
                <li>Home</li>
                {this.state.items.map(function(item, idx) {
                    return <li key={idx}>{item}</li>
                })}
            </ol>
        )
    }
}

export default SmallBreadcrumbs;
