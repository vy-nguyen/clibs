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
        StateButtonStore.changeButton(this.getSaveBtnId(), false, "Save Order");

        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.reRankTag(tag, true);
    },

    moveDown: function(tag, e) {
        e.stopPropagation();
        StateButtonStore.changeButton(this.getSaveBtnId(), false, "Save Order");

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
    },

    renderElement: function(parent, children, output) {
        let reorder = false;
        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.getArrangeBtnId();
            reorder = StateButtonStore.getButtonState(btnId, "arrange");
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
                children : reorder === true ? orderSub : sub,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        }
    },

    _saveState: function(btnId) {
        StateButtonStore.changeButton(btnId, true, "Saving Order");
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.commitTagRanks(btnId);
    },

    _arrangeMode: function(btnId) {
        let reorder = StateButtonStore.getButtonState(btnId, "arrange");
        if (reorder === true) {
            StateButtonStore.changeButton(btnId, false, "Arrange Mode", { "arrange": false });
        } else {
            StateButtonStore.changeButton(btnId, false, "In Arrange Mode", { "arrange": true });
            StateButtonStore.changeButton(this.getSaveBtnId(), false, "Save Order");
        }
    },

    _onChangeNest: function(output) {
        this.setState({
            order: output
        });
    },

    render: function() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        let json = [];
        let btnCmds = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.getSaveBtnId();
            StateButtonStore.saveButtonState(btnId, function() {
                return StateButtonStore.makeSimpleBtn("Order Saved", true);
            });
            let arBtnId = this.getArrangeBtnId();
            StateButtonStore.saveButtonState(arBtnId, function() {
                return StateButtonStore.makeSimpleBtn("Arrange Posts", false, { "arrange": false });
            });
            btnCmds = (
                <div>
                    <ErrorView className="alert alert-success" errorId={btnId}/>
                    <div className="btn-group" role="group">
                        <StateButton btnId={btnId} className="btn btn-default" onClick={this._saveState.bind(this, btnId)}/>
                        <StateButton btnId={arBtnId} className="btn btn-default" onClick={this._arrangeMode.bind(this, arBtnId)}/>
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
