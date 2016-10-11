/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react';
import _            from 'lodash';
import Reflux       from 'reflux';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import TreeView         from 'vntd-shared/layout/TreeView.jsx';
import AccordionView    from 'vntd-shared/layout/AccordionView.jsx';
import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import Nestable         from 'vntd-shared/widgets/Nestable.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import ArticleRank      from 'vntd-root/components/ArticleRank.jsx';

let UserPostView = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore),
        Reflux.connect(StateButtonStore)
    ],

    getSaveBtnId: function() {
        return "my-post-order-" + this.props.userUuid;
    },

    getArrangeBtnId: function() {
        return "arrange-btn-" + this.props.userUuid;
    },

    moveUp: function(tag, e) {
        e.stopPropagation();
        StateButtonStore.setButtonState(this.getSaveBtnId(), "needSave");

        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.reRankTag(tag, true);
    },

    moveDown: function(tag, e) {
        e.stopPropagation();
        StateButtonStore.setButtonState(this.getSaveBtnId(), "needSave");

        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.reRankTag(tag, false);
    },

    renderTag: function(tag, refName, expanded) {
        let upRank = null;
        let downRank = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            upRank = (
                <span className="label label-info" onClick={this.moveUp.bind(this, tag)}>
                    <i className="fa fa-sort-desc"/>Up
                </span>
            );
            downRank = (
                <span className="label label-info" onClick={this.moveDown.bind(this, tag)}>
                    <i className="fa fa-sort-asc"/>Down
                </span>
            );
        }
        return (
            <span>{tag.tagName} {upRank} {downRank}</span>
        );
    },

    _onChangeArt: function(parent, children, output) {
        let tagName = parent.tagName;
        StateButtonStore.setStateKeyVal(this.getArrangeBtnId(), {
            order: {
                tagName: output
            }
        });
    },

    renderElement: function(parent, children, output) {
        let reorder = false;
        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.getArrangeBtnId();
            reorder = StateButtonStore.isButtonInState(btnId, "arrange");
        }
        if (children == null) {
            output.push({
                keyId    : parent._id,
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        } else {
            let sub = []; 
            _.forOwn(children, function(rank) {
                if (reorder === false) {
                    sub.push({
                        renderFn : ArticleRank.render,
                        renderArg: rank
                    });
                } else {
                    sub.push(
                        <li className="dd-item" data-id={rank.articleUuid}>
                            <div className="dd-handle">
                                {ArticleRank.renderNoButton(rank)}
                            </div>
                        </li>
                    );
                }
            });
            let orderSub = null;
            if (reorder === true) {
                orderSub = [ {
                    renderArg: null,
                    renderFn : function() {
                        return (
                            <Nestable group={parent._id} onChange={this._onChangeArt.bind(this, parent, children)}>
                                <div className="dd">
                                    <ol className="dd-list">
                                        {sub}
                                    </ol>
                                </div>
                            </Nestable>
                        );
                    }.bind(this)
                } ];
            }
            output.push({
                keyId    : parent._id,
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                itemCount: reorder === true ? false : true,
                children : reorder === true ? orderSub : sub,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        }
    },

    _saveState: function(btnId) {
        let order = StateButtonStore.getButtonStateKey("order");
        StateButtonStore.goNextState(btnId);
        AuthorStore
            .getAuthorTagMgr(this.props.userUuid)
            .commitTagRanks(btnId, order);
    },

    _saveStateSuccess: function(btnId, prev, curr) {
        StateButtonStore.setButtonState(this.getArrangeBtnId(), "success");
    },

    _arrangeMode: function(btnId) {
        let btnState = StateButtonStore.getButtonState(btnId);
        if (btnState.getStateCode() === "success") {
            let savState = StateButtonStore.getButtonState(this.getSaveBtnId());
            if (savState.getStateCode() === "success") {
                StateButtonStore.setNextButtonState(savState);
            }
        }
        StateButtonStore.setNextButtonState(btnState);
    },

    _createSaveBtn: function() {
        return {
            success: {
                text: "Order Saved",
                disabled : true,
                nextState: "needSave",
                className: "btn btn-default",
                triggerFn: this._saveStateSuccess
            },
            failure: {
                text: "Save order failed",
                disabled : false,
                nextState: "needSave",
                className: "btn btn-default"
            },
            saving: {
                text: "Saving...",
                disabled : true,
                nextState: "success",
                className: "btn btn-danger"
            },
            needSave: {
                text: "Save Order",
                disabled : false,
                nextState: "saving",
                className: "btn btn-success"
            }
        };
    },

    _createArrangeBtn: function() {
        return {
            success: {
                text: "Arrange Posts",
                disabled : false,
                nextState: "arrange",
                className: "btn btn-default"
            },
            failure: {
                text: "Arrange Posts",
                disabled : false,
                nextState: "success",
                className: "btn btn-default"
            },
            arrange: {
                text: "Move Posts To Arrange",
                disabled : false,
                nextState: "success",
                className: "btn btn-success"
            }
        };
    },

    render: function() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        let json = [];
        let btnCmds = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.getSaveBtnId();
            StateButtonStore.createButton(btnId, this._createSaveBtn);

            let arBtnId = this.getArrangeBtnId();
            StateButtonStore.createButton(arBtnId, this._createArrangeBtn);

            btnCmds = (
                <div>
                    <ErrorView className="alert alert-success" errorId={btnId}/>
                    <div className="btn-group" role="group">
                        <StateButton btnId={btnId} onClick={this._saveState.bind(this, btnId)}/>
                        <StateButton btnId={arBtnId} onClick={this._arrangeMode.bind(this, arBtnId)}/>
                    </div>
                </div>
            );
        }
        tagMgr.getTreeViewJson(this.renderElement, json);
        return (
            <div>
                {btnCmds}
                <AccordionView className="no-padding" items={json}/>
            </div>
        );
    }
});

export default UserPostView;
