/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import WalletStore        from 'vntd-root/stores/WalletStore.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';

import StateButton               from 'vntd-shared/utils/StateButton.jsx';
import ComponentBase             from 'vntd-shared/layout/ComponentBase.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class PaymentForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
    }

    initData() {
        let labelFmt = 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt = 'control-label col-sx-8 col-sm-8 col-md-8 col-lg-8',
        entries = [ {
            field   : 'dong',
            labelTxt: Lang.translate('Dong T$'),
            labelFmt: labelFmt,
            inputFmt: inputFmt
        }, {
            field    : 'hao',
            inpHolder: '0',
            labelTxt : Lang.translate('Hao (1T$ = 100Hao)'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'xu',
            inpHolder: '0',
            labelTxt : Lang.translate('Xu (1Hao = 100Xu)'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'recv-acct',
            select   : true,
            selectOpt: WalletStore.getAddressBook(),
            labelTxt : Lang.translate('To Account'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'password',
            inpType  : 'password',
            inpHolder: 'Login Password',
            labelTxt : 'Your password',
            labelIcon: 'fa fa-lock',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        } ];
        this.forms = {
            formId   : 'td-payment',
            formFmt  : 'client-form',
            submitFn : Actions.etherPay,
            formEntries: [ {
                legend : 'Make payment',
                inline : true,
                sectFmt: 'product-deatil',
                entries: entries
            } ],
            buttons: [ {
                btnName  : 'td-cancel',
                btnFmt   : 'btn btn-lg btn-warning',
                btnCreate: function() {
                    return StateButton.basicButton("Cancel")
                }
            }, {
                btnName  : 'td-payment-submit',
                btnFmt   : 'btn btn-lg btn-info',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Payment", "Submit", "Paid");
                }
            } ]
        };
    }

    validateInput(data, errFlags) {
        console.log(data);
        return false;
    }
}

class Payment extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
        this.data = new PaymentForm(props, "");
    }

    _updateState(store, data, code, item) {
    }

    render() {
        console.log(this.props);
        return (
            <div className="well">
                <ProcessForm form={this.data} store={WalletStore}/>
            </div>
        );
    }
}

export default Payment;
