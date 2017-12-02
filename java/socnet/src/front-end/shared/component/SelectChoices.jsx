/*
 * Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import { Util }            from 'vntd-shared/utils/Enum.jsx';
import InputStore          from 'vntd-shared/stores/NestableStore.jsx';
import SelectComp          from 'vntd-shared/component/SelectComp.jsx';

class SelectChoices extends React.Component
{
    constructor(props) {
        super(props);

        this._updateState = this._updateState.bind(this);
        this.state = {
            select: InputStore.getItemIndex(props.id).getItems()
        };
    }

    componentDidMount() {
        this.unsub = InputStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(id, item, code) {
        if (id !== this.props.id) {
            return;
        }
        this.setState({
            select: InputStore.getItemIndex(this.props.id).getItems()
        });
    }

    _compareFn(r1, r2) {
        return r1.label.localeCompare(r2.label);
    }

    _selChoice(item) {
        return item.component;
    }

    getSelectForm(top, data) {
        let out = [];

        _.forOwn(data, function(item) {
            Util.insertSorted(item, out, this._compareFn);
            item.selFn = this._selChoice.bind(this, item);
        }.bind(this));

        top.selFn = this._selChoice.bind(this, top);
        out.unshift(top);
        return {
            selOpt: out
        };
    }

    render() {
        let { id, top } = this.props,
            select = this.getSelectForm(top, this.state.select);

        return <SelectComp id={id} selectOpt={select}/>;
    }
}

SelectChoices.propTypes = {
};

export default SelectChoices;
