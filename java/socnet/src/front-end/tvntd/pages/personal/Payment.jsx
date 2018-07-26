/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import Actions            from 'vntd-root/actions/Actions.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';
import { EthAccount }     from 'vntd-root/stores/EtherStore.jsx';

import StateButton               from 'vntd-shared/utils/StateButton.jsx';
import UserStore                 from 'vntd-shared/stores/UserStore.jsx';
import InputStore                from 'vntd-shared/stores/NestableStore.jsx';
import ComponentBase             from 'vntd-shared/layout/ComponentBase.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class PaymentForm extends FormData
{
    constructor(props, suffix, owner) {
        super(props, suffix);
        this.onSelect = this.onSelect.bind(this);

        this.owner = owner;
        this.entryData = {};
        this.initData();
    }

    initData() {
        let labelFmt = 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt = 'control-label col-sx-8 col-sm-8 col-md-8 col-lg-8',
        entries = [ {
            field    : 'pay-dong',
            labelTxt : Lang.translate('Dong T$'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'pay-hao',
            inpHolder: '0',
            labelTxt : Lang.translate('Hao (1T$ = 100Hao)'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'pay-xu',
            inpHolder: '0',
            labelTxt : Lang.translate('Xu (1Hao = 100Xu)'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'pay-recv-acct',
            select   : true,
            selectOpt: WalletStore.getAddressBook(),
            onSelect : this.onSelect,
            labelTxt : Lang.translate('To Account'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'pay-password',
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
                    return StateButton.saveButtonFsm(
                        "Payment", "Submit", "Paid", "Failed", "Submitting...");
                }
            } ]
        };
    }

    renderFooter() {
        if (this.activeEntry != null) {
            let val = InputStore.getIndexString(this.activeEntry.field);
            this.receiver = WalletStore.getAddressBookEntry(val);
            return this.receiver.getUser(60);
        }
        return null;
    }

    onSelect(entry) {
        this.activeEntry = entry;
        this.selectNotif(entry);
    }

    onBlur(entry) {
        entry.inpDefVal = InputStore.getIndexString(entry.inpName);
        super.onBlur(entry);
    }

    validateInput(data, errFlags) {
        let hao  = this.checkInputNum(data, errFlags, 'pay-hao'),
            xu   = this.checkInputNum(data, errFlags, 'pay-xu'),
            dong = this.checkInputNum(data, errFlags, 'pay-dong');

        if (dong >= 0 && hao >= 0 && xu >= 0 && data['pay-password'] !== "") {
            errFlags.errText = null;
            return {
                ownerUuid  : UserStore.getSelfUuid(),
                toUuid     : this.receiver.ownerUuid,
                fromAccount: this.owner.getAccountNo(),
                toAccount  : this.receiver.account,
                passCode   : data['pay-password'],
                text       : '',
                xuAmount   : EthAccount.toXu(dong, hao, xu)
            };
        }
        console.log("Error");
        console.log(errFlags);
        return null;
    }
}

class Payment extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
        this.data = new PaymentForm(props, "", props.account);
        this.data.selectNotif = this._selectNotif.bind(this);
    }

    _selectNotif(entry) {
        this.setState({
            redraw: true
        });
    }

    _updateState(store, data, code, item) {
    }

    render() {
        return (
            <div className="well">
                <ProcessForm form={this.data} store={WalletStore}/>
            </div>
        );
    }
}

export default Payment;
