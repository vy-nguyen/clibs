/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import TreeView         from 'vntd-shared/layout/TreeView.jsx';
import AccordionView    from 'vntd-shared/layout/AccordionView.jsx';
import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import Nestable         from 'vntd-shared/widgets/Nestable.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import ArticleRank      from 'vntd-root/components/ArticleRank.jsx';

class UserPostView extends React.Component
{
    constructor(props) {
        super(props);

        this.moveUp          = this.moveUp.bind(this);
        this.moveDown        = this.moveDown.bind(this);
        this.renderTag       = this.renderTag.bind(this);
        this.renderElement   = this.renderElement.bind(this);

        this._saveUpdate       = this._saveUpdate.bind(this);
        this._updateState      = this._updateState.bind(this);
        this._createSaveBtn    = this._createSaveBtn.bind(this);
        this._createArrangeBtn = this._createArrangeBtn.bind(this);

        let myUuid      = props.userUuid;
        this.saveBtn    = StateButtonStore.createButton("my-post-order-" + myUuid, this._createSaveBtn);
        this.arrangeBtn = StateButtonStore.createButton("arrange-btn-" + myUuid, this._createArrangeBtn);
        this.state = {
            status: "init",
            tagMgr: AuthorStore.getAuthorTagMgr(props.userUuid)
        };
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
        this.unsubBtn = StateButtonStore.listen(this._saveUpdate);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsubBtn();
            this.unsub = null;
            this.unsubBtn = null;
        }
    }

    _updateState(data) {
        this.setState({
            status: "store changed",
            tagMgr: AuthorStore.getAuthorTagMgr(this.props.userUuid)
        });
    }

    moveUp(tag, e) {
        e.stopPropagation();
        StateButtonStore.setButtonStateObj(this.saveBtn, "needSave");
        this.state.tagMgr.reRankTag(tag, true);
    }

    moveDown(tag, e) {
        e.stopPropagation();
        StateButtonStore.setButtonStateObj(this.saveBtn, "needSave");
        this.state.tagMgr.reRankTag(tag, false);
    }

    renderTag(tag, refName, expanded) {
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
    }

    _onChangeArt(parent, children, output) {
        let tagVal = {};
        tagVal[parent.tagName] = output;
        this.arrangeBtn.setKeyValue('order', tagVal);
    }

    _saveState(btnId) {
        let order = this.arrangeBtn.getValue("order");
        StateButtonStore.goNextState(btnId);
        AuthorStore
            .getAuthorTagMgr(this.props.userUuid)
            .commitTagRanks(btnId, order);
    }

    _saveUpdate(btnState) {
        if (btnState === this.saveBtn) {
            btnState.callTrigger(this);
        }
    }

    static _saveStateSuccess(me, btnId, prev, curr) {
        StateButtonStore.setButtonStateObj(me.arrangeBtn, "success");
        me.setState({
            status: "save ok",
            tagMgr: AuthorStore.getAuthorTagMgr(me.props.userUuid)
        });
    }

    _arrangeMode(btnId) {
        if ((this.arrangeBtn.getStateCode() === "success") &&
            (this.saveBtn.getStateCode() === "success")) {
            StateButtonStore.setNextButtonState(this.saveBtn);
        }
        StateButtonStore.setNextButtonState(this.arrangeBtn);
        this.setState({
            status: "arrange",
            tagMgr: AuthorStore.getAuthorTagMgr(this.props.userUuid)
        });
    }

    renderElement(parent, children, output) {
        let reorder = false;
        if (UserStore.isUserMe(this.props.userUuid) === true) {
            reorder = this.arrangeBtn.isInState("arrange");
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
                        renderFn : ArticleRank.renderArtRank,
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
    }

    _createSaveBtn() {
        return {
            success: {
                text: "Order Saved",
                disabled : true,
                nextState: "needSave",
                className: "btn btn-default",
                triggerFn: UserPostView._saveStateSuccess
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
    }

    _createArrangeBtn() {
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
    }

    render() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        let json = [];
        let btnCmds = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.saveBtn.getBtnId();
            let arBtnId = this.arrangeBtn.getBtnId();
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
}

export default UserPostView;
