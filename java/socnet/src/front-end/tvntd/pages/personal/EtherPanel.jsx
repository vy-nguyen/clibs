/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';

import Panel          from 'vntd-shared/widgets/Panel.jsx';
import ComponentBase  from 'vntd-shared/layout/ComponentBase.jsx';
import Mesg           from 'vntd-root/components/Mesg.jsx';
import Lang           from 'vntd-root/stores/LanguageStore.jsx';
import WalletStore    from 'vntd-root/stores/WalletStore.jsx';
import Wallet         from 'vntd-root/pages/personal/Wallet.jsx';

class NewWallet extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return <h2>New Wallet</h2>
    }
}

class NewAccount extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return <h2>New Account</h2>
    }
}

class EditWallet extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return <h2>Edit Wallet</h2>
    }
}

class ReqMicroCredit extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return <h2>Request Micro Credit</h2>
    }
}

class EtherPanel extends React.Component
{
    constructor(props) {
        // super(props, null, WalletStore);
        super(props);
        this.switchData  = this.switchData.bind(this);
        this._newWallet  = this._newWallet.bind(this);
        this._newAccount = this._newAccount.bind(this);
        this._editWallet = this._editWallet.bind(this);

        this._myWalletInfo    = this._myWalletInfo.bind(this);
        this._moreMicroCredit = this._moreMicroCredit.bind(this);

        this.myWalletMenu = [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: Lang.translate('Edit Wallets'),
            itemHandler: this._editWallet
        }, {
            itemFmt : 'fa fa-circle txt-color-yellow',
            itemText: Lang.translate('New Wallet'),
            itemHandler: this._newWallet
        }, {
            itemFmt : 'fa fa-circle txt-color-yellow',
            itemText: Lang.translate('New Account'),
            itemHandler: this._newAccount
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

    _newAccount() {
        this.setState({
            type : 'new-account',
            title: Lang.translate('New Account'),
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

        case 'new-account':
            this._newAccount(); break;

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

        case 'new-account':
            return <NewAccount/>;

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
