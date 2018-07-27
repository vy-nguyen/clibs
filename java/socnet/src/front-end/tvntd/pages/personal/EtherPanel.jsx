/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';

import Panel          from 'vntd-shared/widgets/Panel.jsx';
import ErrorView      from 'vntd-shared/layout/ErrorView.jsx';
import ComponentBase  from 'vntd-shared/layout/ComponentBase.jsx';
import StateButton    from 'vntd-shared/utils/StateButton.jsx';
import InputStore     from 'vntd-shared/stores/NestableStore.jsx';

import Actions        from 'vntd-root/actions/Actions.jsx';
import Mesg           from 'vntd-root/components/Mesg.jsx';
import Lang           from 'vntd-root/stores/LanguageStore.jsx';
import WalletStore    from 'vntd-root/stores/WalletStore.jsx';
import Wallet         from 'vntd-root/pages/personal/Wallet.jsx';
import DynamicTable   from 'vntd-root/components/DynamicTable.jsx';

import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class NewWalletForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.defWallet = WalletStore.getDefWallet();

        InputStore.storeItemIndex('new-wallet-name',
            this.defWallet != null ? this.defWallet.getName() : "My Wallet");
        this.initData();
    }

    initData() {
        let labelFmt = 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt = 'control-label col-sx-7 col-sm-7 col-md-7 col-lg-7',
        entries = [ {
            field    : 'new-wallet-name',
            labelTxt : Lang.translate('Wallet Name'),
            typeAhead: true,
            taOptions: WalletStore.getTAOptions(),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'new-acct-name',
            labelTxt : Lang.translate('Account Name'),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'new-acct-priv',
            labelTxt : Lang.translate('Private'),
            checkedBox: true
        } ];
        this.forms = {
            formId   : 'new-acct-form',
            formFmt  : 'client-form',
            submitFn : Actions.newWalletAcct,
            formEntries: [ {
                legend : Lang.translate('New Wallet/Account'),
                inline : true,
                sectFmt: 'product-deatil',
                entries: entries
            } ],
            buttons: [ {
                btnName  : 'new-acct-cancel',
                btnFmt   : 'btn btn-lg btn-warning',
                btnCancel: true,
                btnCreate: function() {
                    return StateButton.basicButton('Cancel')
                }
            }, {
                btnName  : 'new-acct-submit',
                btnFmt   : 'btn btn-lg btn-info',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm(
                        "Edit", "Submit", "Saved", "Failed", "Saving..."
                    );
                }
            } ]
        };
    }

    onSelect(entry) {
    }

    validateInput(data, errFlags) {
        console.log("validate data");
        console.log(data);
        return null;
    }
}

class NewWallet extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
        this.data = new NewWalletForm(props, "");
        this.data.selectNotif = this._selectNotif.bind(this);
    }

    _selectNotif(entry) {
        this.setState({
            redraw: true
        });
    }

    render() {
        return (
            <div className="well">
                <ProcessForm form={this.data} store={WalletStore}/>
            </div>
        );
    }
}

class EditWallet extends React.Component
{
    constructor(props) {
        super(props);
        this._deleteWallet  = this._deleteWallet.bind(this);
        this._submitChanges = this._submitChanges.bind(this);

        this.footerHasWallet = [ {
            format: 'btn btn-lg btn-primary pull-right',
            title : 'Save Changes',
            onSubmit: this._submitChanges
        } ];
        this.footer = [ {
            format: 'btn btn-primary pull-right',
            title : 'Save Changes',
            onSubmit: this._submitChanges
        }, {
            format: 'btn btn-danger pull-right',
            title : 'Delete Wallet',
            onSubmit: this._deleteWallet
        } ];
        this.tabHeader = [ {
            key   : 'account',
            header: Lang.translate('Account')
        }, {
            key   : 'acct-name',
            header: Lang.translate('Name')
        }, {
            key   : 'acct-type',
            header: Lang.translate('Private')
        } ];
    }

    _getErrorId() {
        return 'edit-wallet';
    }

    _submitChanges(changes) {
    }

    _deleteWallet(changes) {
    }

    _getTableData() {
        return null;
    }

    render() {
        let tabData = this._getTableData();

        return (
            <div className="well">
                <DynamicTable tableFormat={this.tableHeader} tabData={tabData}
                    tableTitle="Wallet"
                    tableFooter={this.footer} cloneRow={null}
                    select={true} tableId="edit-wallet-table">
                    <ErrorView mesg={true} errorId={this._getErrorId()}/>
                </DynamicTable>
            </div>
        );
    }
}

class ReqMicroCredit extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="well">
                <h2>Request Micro Credit</h2>
            </div>
        );
    }
}

class EtherPanel extends React.Component
{
    constructor(props) {
        // super(props, null, WalletStore);
        super(props);
        this.switchData  = this.switchData.bind(this);
        this._newWallet  = this._newWallet.bind(this);
        this._editWallet = this._editWallet.bind(this);

        this._myWalletInfo    = this._myWalletInfo.bind(this);
        this._moreMicroCredit = this._moreMicroCredit.bind(this);

        this.myWalletMenu = [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: Lang.translate('Edit Wallets'),
            itemHandler: this._editWallet
        }, {
            itemFmt : 'fa fa-circle txt-color-yellow',
            itemText: Lang.translate('New Wallet/Account'),
            itemHandler: this._newWallet
        }, {
            itemFmt : 'fa fa-circle txt-color-blue',
            itemText: Lang.translate('Request Micropay Credits'),
            itemHandler: this._moreMicroCredit
        } ];
        this.newMenu = [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: Lang.translate('My Wallets'),
            itemHandler: this._myWalletInfo
        } ];

        this.menu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: Lang.translate('Menu'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: null
        };
        this.state = {
            type : 'wallet',
            title: Lang.translate('My Wallet'),
            menuItems: this.myWalletMenu
        };
    }

    _newWallet() {
        this.setState({
            type : 'new-wallet',
            title: Lang.translate('New Wallet'),
            menuItems: this.newMenu
        });
    }

    _editWallet() {
        this.setState({
            type : 'edit-wallet',
            title: Lang.translate('Edit Wallet'),
            menuItems: this.newMenu
        });
    }

    _myWalletInfo() {
        this.setState({
            type : 'wallet',
            title: Lang.translate('My Wallet'),
            menuItems: this.myWalletMenu
        });
    }

    _moreMicroCredit() {
        this.setState({
            type : 'get-micro',
            title: Lang.translate('Request MicroPay Credit'),
            menuItems: this.newMenu
        });
    }

    switchData(type, data) {
        switch(type) {
        case 'wallet':
            this._myWalletInfo(); break;

        case 'new-wallet':
            this._newWallet(); break;

        case 'edit-wallet':
            this._editWallet(); break;

        default:
        }
    }

    _renderContent(state) {
        switch(state.type) {
        case 'wallet':
            return <Wallet/>;

        case 'new-wallet':
            return <NewWallet/>;

        case 'edit-wallet':
            return <EditWallet/>;

        case 'get-micro':
        default:
            return <ReqMicroCredit/>
        }
        return null;
    }

    render() {
        let panelDef, state = this.state;

        this.menu.menuItems = state.menuItems;
        panelDef = {
            init  : false,
            icon  : 'fa fa-money',
            header: state.title,
            headerMenus: [this.menu]
        };
        return (
            <Panel context={panelDef}>
                {this._renderContent(state)}
                {this.props.children}
            </Panel>
        );
    }
}

export default EtherPanel;
