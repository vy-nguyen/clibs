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
        console.log("On change order");
        console.log(output);
        console.log(parent);
        console.log(children);
    },

    renderElement: function(parent, children, output) {
        if (children == null) {
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        } else {
            let sub = []; 
            _.forOwn(children, function(rank) {
                sub.push({
                    renderFn: ArticleRank.render,
                    renderArg: rank
                });
                /*
                sub.push(
                    <li className="dd-item" data-id={rank.articleUuid}>
                        <div className="dd-handle">
                            {ArticleRank.render(rank)}
                        </div>
                    </li>
                );
                 */
            });
            let childSub = (
                <Nestable group={parent._id} onChange={this._onChangeArt.bind(this, parent, children)}>
                    <div className="dd">
                        <ol className="dd-list">
                            {sub}
                        </ol>
                    </div>
                </Nestable>
            );
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                children : sub,
                    /*
                children : [ {
                    renderArg: null,
                    renderFn : function() {
                        return childSub;
                    }
                    } ],
                     */
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

    _onChangeNest: function(output) {
        this.setState({
            order: output
        });
    },

    render: function() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        let json = [];
        let commitBtn = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            let btnId = this.getSaveBtnId();
            StateButtonStore.saveButtonState(btnId, function() {
                return StateButtonStore.makeSimpleBtn("Order Saved", true);
            });
            commitBtn = (
                <div>
                    <ErrorView className="alert alert-success" errorId={btnId}/>
                    <StateButton btnId={btnId} className="btn btn-default" onClick={this._saveState.bind(this, btnId)}/>
                </div>
            );
        }
        tagMgr.getTreeViewJson(this.renderElement, json);
        return (
            <div>
                {commitBtn}
                <AccordionView className="no-padding" items={json}/>
                {/*
                <Nestable group="1" onChange={this._onChangeNest}>
                    <div className="dd">
                        <ol className="dd-list">
                            <li className="dd-item" data-id="1">
                                <div className="dd-handle">
                                    Item 1
                                    <h4>This is item 1</h4>
                                </div>
                            </li>
                            <li className="dd-item" data-id="2">
                                <div className="dd-handle">
                                    Item 2
                                    <h4>This is item 2</h4>
                                </div>
                            </li>
                            <li className="dd-item" data-id="3">
                                <div className="dd-handle">
                                    Item 3
                                    <h4>This is item 3</h4>
                                </div>
                            </li>
                            <li className="dd-item" data-id="4">
                                <div className="dd-handle">
                                    Item 4
                                    <h4>This is item 4</h4>
                                </div>
                            </li>
                        </ol>
                    </div>
                </Nestable>
                  */}
            </div>
        );
    }
});

export default UserPostView;
