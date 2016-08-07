/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _           from 'lodash';
import React       from 'react-mod';

/*
 * Form format:
 * formEntry {
 *     legend: "",
 *     entries: [
 *         labelFmt: "",
 *         labelTxt: "",
 *         inputFmt: "",
 *         inpName : "",
 *         inpHolder: ""
 *     ]
 * }
 * Form {
 *     formFmt: "",
 *     hiddenHead: "",
 *     hiddenTail: "",
 *     formEntries: []
 *     buttons: [ {
 *         btnFmt: "",
 *         btnText" "",
 *         onClick: function...
 *     } ]
 * }
 */
let GenericForm = React.createClass({

    _btnClick: function(button, event) {
        let dataRefs = {};
        let entries = this.props.form.formEntries;

        event.preventDefault();
        _.forEach(entries, function(section) {
            _.forEach(section.entries, function(item) {
                console.log(item.inpName);
                console.log(this.refs[item.inpName]);
                dataRefs[item.inpName] = this.refs[item.inpName].value;
            }.bind(this));
        }.bind(this));
        button.onClick(dataRefs);
    },

    render: function() {
        let form = this.props.form;
        let formButtons = null;

        if (form.buttons != null) {
            let buttons = form.buttons.map(function(item, idx) {
                return (
                    <a key={idx} className={item.btnFormat} onClick={this._btnClick.bind(this, item)}>{item.btnText}</a>
                );
            }.bind(this));
            formButtons = (
                <footer>
                    <div className="row form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="pull-right">
                                {buttons}
                            </div>
                        </div>
                    </div>
                </footer>
            );
        }
        let formEntries = form.formEntries.map(function(item, idx) {
            let entries = item.entries.map(function(entry, index) {
                return (
                    <div className="row form-group" key={index}>
                        <label className={entry.labelFmt} for="textinput">{entry.labelTxt}</label>
                        <div className={entry.inputFmt}>
                            <input type="text" className="form-control"
                                name={entry.inpName} ref={entry.inpName} placeholder={entry.inpHolder}
                            />
                        </div>
                    </div>
                );
            });
            return (
                <div key={idx}>
                    {item.legend != null ? <legend>{item.legend}</legend> : null}
                    <fieldset>
                        {entries}
                    </fieldset>
                </div>
            );
        });

        return (
            <form className={form.formFmt}>
                {form.hiddenHead}
                {formEntries}
                {formButtons}
            </form>
        );
    }
});

export default GenericForm;
