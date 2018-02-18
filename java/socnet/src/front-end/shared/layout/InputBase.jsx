/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import Lang                from 'vntd-root/stores/LanguageStore.jsx';
import SmallBreadcrumbs    from 'vntd-shared/layout/SmallBreadcrumbs.jsx';
import Panel               from 'vntd-shared/widgets/Panel.jsx';
import ModalConfirm        from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import ComponentBase       from 'vntd-shared/layout/ComponentBase.jsx';

class InputBase extends ComponentBase
{
    constructor(props, id, stores) {
        super(props, id, stores);

        this.delText     = Lang.translate(props.delText || 'Delete this item?');
        this._cancelDel  = this._cancelDel.bind(this);
        this._deletePost = this._deletePost.bind(this);
    }

    _renderForm() {
        return null;
    }

    _deletePost() {
        this.refs.modal.closeModal();
    }

    _cancelDel() {
        this.refs.modal.closeModal();
    }

    _isOwner() {
        return false;
    }

    _getHeaderMenu() {
        if (this._isOwner() !== true) {
            return null;
        }
        return [ {
            iconFmt  : 'btn-xs btn-success',
            titleText: Lang.translate('Options'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: this.delText,
                itemHandler: function(e, pane) {
                    this.refs.modal.openModal();
                }.bind(this)
            } ]
        } ];
    }

    _getPanelLabel() {
        return '';
    }

    _getDeleteModal() {
        let fmt = "btn btn-primary pull-right";
        return (
            <ModalConfirm ref="modal" height="auto" modalTitle="Delete this item?">
                <div className="modal-footer">
                    <button className={fmt} onClick={this._deletePost}>
                        <Mesg text="Ok Delete"/>
                    </button>
                    <button className={fmt} onClick={this._cancelDel}>
                        <Mesg text="Cancel"/> 
                    </button>
                </div>
            </ModalConfirm>
        );
    }

    render() {
        const panelData = {
            icon   : 'fa fa-book',
            header : this.title,
            headerMenus: this._getHeaderMenu(),
            panelLabel : this._getPanelLabel()
        };
        let content = (
            <Panel className="well no-padding" context={panelData}>
                {this._getDeleteModal()}
                <div className="widget-body">
                    {this._renderForm()}
                </div>
            </Panel>
        );
        if (this.crumbRoute != null && this.crumbLabel != null) {
            return (
                <div id={this.id || _.uniqueId()}>
                    <SmallBreadcrumbs id="route-map"
                        crumb={this.crumbLabel} route={this.crumbRoute}/>
                    {content}
                </div>
            );
        }
        return content;
    }
}

export default InputBase;
