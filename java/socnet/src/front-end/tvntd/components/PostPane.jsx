/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import Reflux       from 'reflux';
import TA           from 'react-typeahead';

import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import AdminStore   from 'vntd-root/stores/AdminStore.jsx';
import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';

let TagPost = React.createClass({

    //mixins: [
    //    Reflux.connect(AuthorStore)
    //],

    _onBlur: function(val) {
        this.setState({
            tagName: val.target.value
        });
    },

    _onOptionSelected: function(val) {
        this.setState({
            tagName: val
        });
    },

    _onChangeFav: function() {
        this.setState({
            favorite: !this.state.favorite
        });
    },

    _submitUpdate: function(btnId) {
        let tagInfo = {
            tagName    : this.state.tagName,
            favorite   : this.state.favorite,
            userUuid   : this.props.authorUuid,
            title      : this.refs.title.value,
            likeInc    : 0,
            shareInc   : 0,
            articleUuid: this.props.articleUuid,
            cbButtonId : btnId
        };
        if (!_.isEmpty(this.refs.title.value)) {
            this.setState({
                artTitle: this.refs.title.value
            });
        }
        StateButtonStore.getButtonState(btnId).setNextState();
        let artRank = AuthorStore.getArticleRank(this.props.authorUuid, this.props.articleUuid);
        AuthorStore.updateAuthorTag(tagInfo, artRank);
    },

    _updateSuccess: function(btnId, prev, curr) {
    },

    getInitialState: function() {
        let artRank = AuthorStore.getArticleRank(this.props.authorUuid, this.props.articleUuid);
        let tagName = artRank != null ? artRank.tagName : "My Post";

        return {
            tagText : "Tag your article",
            artRank : artRank,
            tagName : tagName,
            buttonId: "chg-tag-" + this.props.articleUuid
        };
    },

    _createUpdateBtn: function() {
        return {
            success: {
                text     : "Update",
                disabled : false,
                nextState: "updating",
                className: "btn btn-primary",
                triggerFn: this._updateSuccess
            },
            failure: {
                text     : "Update Failed",
                disabled : false,
                nextState: "updating",
                className: "btn btn-danger"
            },
            updating: {
                text     : "Updating",
                disabled : true,
                nextState: "success",
                className: "btn btn-default"
            }
        };
    },

    render: function() {
        let btnId = this.state.buttonId;
        let allTags = AuthorStore.getTagsByAuthorUuid(this.props.authorUuid);
        let artTitle = this.state.artTitle == null ? this.props.artTitle : this.state.artTitle;

        StateButtonStore.createButton(btnId, this._createUpdateBtn);
        return (
            <form enclType="form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <TA.Typeahead options={allTags} maxVisible={6}
                            placeholder={this.state.tagName} value={this.state.tagName}
                            customClasses={{input: "form-control input-sm"}}
                            onBlur={this._onBlur} onOptionSelected={this._onOptionSelected}/>
                    </div>
                    <StateButton btnId={btnId} onClick={this._submitUpdate.bind(this, btnId)}/>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <input className="form-control input-lg" ref="title" placeholder={artTitle}/>
                    </div>
                </div>
                </form>
        );
    }
});

let PostPane = React.createClass({

    _rawMarkup: function() {
        return { __html: this.props.data.content };
    },

    render: function() {
        let adminItem = null;
        if (UserStore.amIAdmin() == true) {
            adminItem = {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Publish Post',
                itemHandler: function(e, pane) {
                    e.preventDefault();
                    AdminStore.addPublicArticle(this.props.data.articleUuid);
                }.bind(this)
            };
        }
        const ownerPostMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Options',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Mark Favorite',
                itemHandler: function() {
                }
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: 'Delete Post',
                itemHandler: function(e, pane) {
                    e.preventDefault();
                    Actions.deleteUserPost(this.props.data.articleUuid);
                    console.log(this);
                    console.log("Delete uuid " + this.props.data.articleUuid);
                    console.log("----------");
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Tag Post',
                itemHandler: function() {
                }
            } ]
        };
        if (adminItem != null) {
            ownerPostMenu.menuItems.push(adminItem);
        }
        const panelData = {
            icon   : 'fa fa-book',
            header : toDateString(this.props.data.createdDate),
            headerMenus: [ownerPostMenu],
            panelLabel: [ {
                labelIcon: 'label label-success',
                labelText: this.props.data.moneyEarned
            }, {
                labelIcon: 'label label-warning',
                labelText: this.props.data.creditEarned
            } ]
        };
        const divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        let tagPost = null;
        let article = this.props.data;
        if (UserStore.isUserMe(article.authorUuid)) {
            tagPost = (
                <TagPost articleUuid={article.articleUuid} artTitle={article.topic} authorUuid={article.authorUuid}
                    id={_.uniqueId('tag-post-')} />
            );
        } else {
            tagPost = <h2>{article.topic ? article.topic : "Post"}</h2>
        }
        return (
            <Panel className="well no-padding" context={panelData}>
                {tagPost}
                <PostItem data={article.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <PostComment articleUuid={article.articleUuid}/>
            </Panel>
        )
    }
});

export default PostPane;
