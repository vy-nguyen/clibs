/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

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
    render: function() {
        let form = this.props.form;

        if (form.hiddenHead == null) {
            form.hiddenHead = <div></div>;
        }
        if (form.hiddenTail == null) {
            form.hiddenTail = <div></div>;
        }
        let form_buttons = <div></div>;
        if (form.buttons != null) {
            let buttons = form.buttons.map(function(item, idx) {
                return (
                    <button id={idx} className={item.btnFormat} onClick={item.onClick}>{item.btnText}</button>
                );
            });
            form_buttons = (
                <fieldset>
                    <div className="row form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="pull-right">
                                {buttons}
                            </div>
                        </div>
                    </div>
                </fieldset>
            );
        }
        let form_entries = form.formEntries.map(function(item, idx) {
            let entries = item.entries.map(function(entry, index) {
                return (
                    <div className="row form-group" id={index}>
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
                <div id={idx}>
                    <legend>{item.legend}</legend>
                    <fieldset>
                        {entries}
                    </fieldset>
                </div>
            );
        });

        return (
            <form className={form.formFmt}>
                {form.hiddenHead}
                {form_entries}
                {form_buttons}
            </form>
        );
    }
});

export default GenericForm;
