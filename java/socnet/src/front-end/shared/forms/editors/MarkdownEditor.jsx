/*
 * Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import marked        from 'marked';
import SimpleMDE     from 'simplemde';

import {choose}      from 'vntd-shared/utils/Enum.jsx';
import NestableStore from 'vntd-shared/stores/NestableStore.jsx';

class MarkdownEditor extends React.Component
{
    constructor(props) {
        super(props);
        this._bindMDE      = this._bindMDE.bind(this);
        this._addEvents    = this._addEvents.bind(this);
        this._removeEvents = this._removeEvents.bind(this);
        this._mdeEvent     = this._mdeEvent.bind(this);
        this._toolbarEvent = this._toolbarEvent.bind(this);

        this._idDiv = `${props.id}-div`;
        this.state = {
            newValue: false
        };
    }

    _bindMDE() {
        console.log("Bind mde ");
        console.log(this);
        if (this._mde != null) {
            return;
        }
        const { id, entry } = this.props;
        let opts = {
            element     : document.getElementById(id),
            initialValue: entry.inpHolder
        }
        if (!_.isEmpty(this.props.options)) {
            opts = _.assign(opts, this.props.options);
        }
        this._mde = new SimpleMDE(opts);
        console.log(this);
    }


    _mdeEvent() {
        this.setState({
            newValue: true
        });
        this._toolbarEvent();
    }

    _toolbarEvent() {
        let value = this._mde.value();
        NestableStore.storeItemIndex(this.props.id, value, true);

        if (this.props.onChange != null) {
            this.props.onChange(value);
        }
    }

    _addEvents() {
        if (this._mdeEvt == null) {
            const divEvt = document.getElementById(this._idDiv);
            this._mdeEvt = divEvt.getElementsByClassName('CodeMirror')[0];
            this._mdeToolbarEvt = divEvt.getElementsByClassName('editor-toolbar')[0];
        }
        this._mdeEvt.addEventListener('keyup', this._mdeEvent);
        this._mdeToolbarEvt.addEventListener('click', this._toolbarEvent);
        console.log("Add events");
        console.log(this);
    }

    _removeEvents() {
        console.log("Remove events");
        console.log(this);
        if (this._mdeEvt != null) {
            this._mdeEvt.removeEventListener('keyup', this._mdeEvent);
            this._mdeToolbarEvt.removeEventListener('click', this._toolbarEvent);
        }
        this._mdeEvt = null;
        this._mdeToolbarEvt = null;
    }

    componentDidMount() {
        this._bindMDE();
        this._addEvents();
    }

    componentWillMount() {
        this._removeEvents();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.newValue) {
            this._mde.value(nextProps.value);
        }
        this.setState({
            newValue: false
        });
    }

    render() {
        const { id, entry } = this.props;
        const style = {
            'border'   : '1px solid blue',
            'minHeight': 200,
            'height'   : 'auto',
            'overflowY': 'hidden'
        };
        return (
            <div id={this._idDiv} style={style}>
                <textarea id={id}/>
            </div>
        )
    }
}

MarkdownEditor.defaultProps = {
    options: {}
};

export default MarkdownEditor;
