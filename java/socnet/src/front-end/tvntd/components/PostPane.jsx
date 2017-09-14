/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import TA           from 'react-typeahead';

import Actions      from 'vntd-root/actions/Actions.jsx';
import Lang         from 'vntd-root/stores/LanguageStore.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import ArticleBox   from 'vntd-root/components/ArticleBox.jsx';
import Mesg         from 'vntd-root/components/Mesg.jsx'
import PostItem     from 'vntd-root/components/PostItem.jsx';
import RefLinks     from 'vntd-root/components/RefLinks.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import ModalConfirm from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import EditorPost   from 'vntd-shared/forms/commons/EditorPost.jsx';
import InputStore   from 'vntd-shared/stores/NestableStore.jsx';

import ArticleStore     from 'vntd-root/stores/ArticleStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { Util }         from 'vntd-shared/utils/Enum.jsx';
import { VntdGlob }     from 'vntd-root/config/constants.js';
import {
    InputInline, TAWrap, InputWrap
}  from 'vntd-shared/forms/commons/GenericForm.jsx';

class TagPost extends React.Component
{
    constructor(props) {
        super(props);

        this._buttonId        = "chg-tag-" + props.notifyId;
        this._setupIds        = this._setupIds.bind(this);
        this._submitUpdate    = this._submitUpdate.bind(this);
        this._updateSuccess   = this._updateSuccess.bind(this);
        this._createUpdateBtn = this._createUpdateBtn.bind(this);
        this._getTagValue     = this._getTagValue.bind(this);
        this._getTitleValue   = this._getTitleValue.bind(this);
        this._getRankValue    = this._getRankValue.bind(this);

        this._setupIds(props.article.articleUuid);
        StateButtonStore.createButton(this._buttonId, this._createUpdateBtn);
        this.state = {
            editMode: false
        };
    }

    _setupIds(artUuid) {
        this._tagId    = 'tag-post-' + artUuid;
        this._titleId  = 'tag-post-title-' + artUuid;
        this._rankId   = 'tag-post-rank-' + artUuid;
    }

    _submitUpdate(btnId) {
        let tagInfo, state, article = this.props.article,
            artRank = article.rank, artUuid = article.articleUuid;

        this._setupIds(artUuid);
        tagInfo = {
            tagName    : this._getTagValue(artRank),
            userUuid   : article.getAuthorUuid(),
            title      : this._getTitleValue(artRank),
            rank       : this._getRankValue(artRank),
            likeInc    : 0,
            shareInc   : 0,
            articleUuid: artUuid,
            cbButtonId : this._buttonId,
            prevArticle: InputStore.getItemIndex(RefLinks.getPrevRefArtId(artUuid)),
            nextArticle: InputStore.getItemIndex(RefLinks.getNextRefArtId(artUuid))
        };
        state = StateButtonStore.getButtonState(btnId).setNextState();
        artRank = AuthorStore.getArticleRankByUuid(artUuid, article.getAuthorUuid());
        AuthorStore.updateAuthorTag(tagInfo, artRank);
        this._updateSuccess(state, this._buttonId, null);
    }

    _updateSuccess(state, btnId, prev) {
        this.setState({
            editMode: false
        });
    }

    _changeMode(btnId) {
        StateButtonStore.setButtonState(this._buttonId, "update");
        this.setState({
            editMode: true
        });
    }

    _cancelEdit() {
        let article = this.props.article, artRank = article.rank;

        InputStore.storeItemIndex(this._tagId, artRank.tagName, true);
        InputStore.storeItemIndex(this._titleId, artRank.artTitle, true);
        InputStore.storeItemIndex(this._rankId, artRank.rank || 10);
        this.setState({
            editMode: false
        });
        StateButtonStore.setButtonState(this._buttonId, "success");
    }

    _createUpdateBtn() {
        return {
            success: {
                text     : Lang.translate("Change Header"),
                disabled : false,
                nextState: "update",
                className: "btn btn-primary",
                triggerFn: this._updateSuccess
            },
            update: {
                text     : Lang.translate("Update"),
                disabled : false,
                nextState: "updating",
                className: "btn btn-warning"
            },
            failure: {
                text     : Lang.translate("Update Failed"),
                disabled : false,
                nextState: "updating",
                className: "btn btn-danger"
            },
            updating: {
                text     : Lang.translate("Updating"),
                disabled : true,
                nextState: "success",
                className: "btn btn-default"
            }
        };
    }

    _getTagValue(artRank) {
        return InputStore.getItemIndex(this._tagId) || artRank.tagName || "My Post";
    }

    _getTitleValue(artRank) {
        return InputStore.getItemIndex(this._titleId) || artRank.artTitle;
    }

    _getRankValue(artRank) {
        return InputStore.getItemIndex(this._rankId) || artRank.rank || 10;
    }

    _renderTitle(title, artRank) {
        return (
            <div className="row">
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                    <h2>{title}</h2>
                </div>
                <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                    <span className="label label-success">
                        {artRank.tagName}
                    </span>
                </div>
            </div>
        );
    }

    render() {
        let article = this.props.article, refLink = null,
            artRank, value, tagEntry, titleEntry, rankEntry;

        artRank = article.rank;
        value = this._getTitleValue(artRank);

        if (!UserStore.isUserMe(article.authorUuid)) {
            return this._renderTitle(value, artRank);
        }
        this._setupIds(article.articleUuid);
        refLink = (
            <RefLinks article={article}
                edit={this.state.editMode} notifyId={this.props.notifyId}/>
        );
        if (this.state.editMode === false) {
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                            {this._renderTitle(value, artRank)}
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                            <StateButton btnId={this._buttonId}
                                onClick={this._changeMode.bind(this, this._buttonId)}/>
                        </div>
                    </div>
                    {refLink}
                </div>
            );
        }
        tagEntry = {
            inpName  : this._tagId,
            inpHolder: this._getTagValue(artRank),
            taOptions: AuthorStore.getTagsByAuthorUuid(article.authorUuid)
        };
        titleEntry = {
            inpName  : this._titleId,
            inpDefVal: value,
            inpHolder: value 
        };
        value = this._getRankValue(artRank);
        rankEntry = {
            inpName  : this._rankId,
            inpDefVal: value,
            inpHolder: value
        };
        return (
            <div>
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <TAWrap entry={tagEntry}/>
                    </div>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                        <StateButton btnId={this._buttonId}
                            onClick={this._submitUpdate.bind(this, this._buttonId)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <InputWrap entry={titleEntry}/>
                    </div>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                        <InputWrap entry={rankEntry}/>
                    </div>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                        <button className="btn btn-default" type="button"
                            onClick={this._cancelEdit.bind(this)}>
                            <Mesg text="Cancel"/>
                        </button>
                    </div>
                </div>
                {refLink}
            </div>
        );
    }
}

class PublishArticle extends React.Component {
    constructor(props) {
        super(props);
        this._cancelPublish = this._cancelPublish.bind(this);
        this._submitArticle = this._submitArticle.bind(this);
    }

    _cancelPublish() {
        this.props.doneFn();
    }

    _submitArticle() {
        let article = this.props.article, rank = article.rank;

        Actions.changeTagArt({
            articleUuid: article.articleUuid,
            authorUuid : article.authorUuid,
            rank       : rank.rank,
            score      : rank.score,
            favorite   : rank.favorite,
            privTag    : rank.tagName,
            publicTag  : InputStore.getIndexString("pub-article"),
            published  : article.published
        });
        this.props.doneFn();
    }

    render() {
        const fmt = "btn btn-primary pull-right";
        let selOpt = ArticleTagStore.getPublicTagsSelOpt("blog"),
            selDef = !_.isEmpty(selOpt) ? selOpt[0].label : null,
        pubCat = {
            select   : true,
            inpName  : "pub-article",
            inpDefVal: selDef,
            inpHolder: selDef,
            selectOpt: selOpt,
            onSelect : null,
            errorId  : "pub-article",
            errorFlag: null,
            labelTxt : "Category",
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        };

        return (
            <div className="product-deatil">
                <div className="row">
                    <InputInline entry={pubCat}/>
                </div>
                <div className="modal-footer">
                    <button className={fmt} onClick={this._submitArticle}>
                        <Mesg text="Submit"/>
                    </button>
                    <button className={fmt} onClick={this._cancelPublish}>
                        <Mesg text="Cancel"/>
                    </button>
                </div>
            </div>
        );
    }
}

class PostPane extends React.Component
{
    constructor(props) {
        let article = props.data, active, artRank, authorUuid,
            articleUuid = article.getArticleUuid();

        super(props);
        this._postPaneId = "post-pane-" + articleUuid;
        active = InputStore.getItemIndex(this._postPaneId);
        if (active == null) {
            artRank = article.rank;
            if (artRank != null) {
                if (artRank.publishPost == null) {
                    artRank.publishPost = false;
                }
            } else {
                authorUuid = article.getAuthorUuid();
                artRank = AuthorStore.getArticleRankByUuid(articleUuid, authorUuid);

                if (artRank == null) {
                    artRank = {
                        editMode   : false,
                        favorite   : false,
                        publishPost: false
                    };
                }
            }
        } else {
            artRank = active.artRank;
            article = ArticleStore.getArticleByUuid(active.artUuid);
        }
        this.state = {
            artRank : artRank,
            article : article,
            favorite: artRank.favorite,
            publish : artRank.publishPost,
            editMode: artRank.editMode
        };
        if (ArticleTagStore.hasPublishedArticle(articleUuid)) {
            this.state.publish = true;
        }
        this._cancelDel      = this._cancelDel.bind(this);
        this._editArticle    = this._editArticle.bind(this);
        this._toggleFavorite = this._toggleFavorite.bind(this);
        this._donePublish    = this._donePublish.bind(this);
        this._updateState    = this._updateState.bind(this);
        this._getOwnerMenu   = this._getOwnerMenu.bind(this);
        this._getAdminMenu   = this._getAdminMenu.bind(this);
    }

    componentDidMount() {
        this.unsub = InputStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(active, key, what) {
        let artRank = active.artRank;

        if (key !== this._postPaneId) {
            return;
        }
        this.setState({
            artRank : active.artRank,
            article : ArticleStore.getArticleByUuid(active.artUuid),
            favorite: artRank.favorite,
            publish : artRank.publishPost
        });
    }

    _rawMarkup(article) {
        return { __html: article.content };
    }

    _deletePost(article) {
        Actions.deleteUserPost({
            authorUuid: UserStore.getSelfUuid(),
            uuidType  : "article",
            uuids     : [ article.articleUuid ]
        });
        this.refs.modal.closeModal();
    }

    _cancelDel() {
        this.refs.modal.closeModal();
    }

    _toggleFavorite() {
        let artRank = this.state.artRank;
        artRank.favorite = !this.state.favorite;
        this.setState({
            favorite: artRank.favorite
        });
        Actions.updateArtRank({
            tagName    : artRank.tagName,
            articleUuid: artRank.articleUuid,
            userUuid   : artRank.authorUuid,
            favorite   : artRank.favorite,
            likeInc    : 0,
            shareInc   : 0
        });
    }

    _donePublish() {
        this.refs.publish.closeModal();
    }

    _editArticle() {
        this.setState({
            editMode: true
        });
    }

    _getOwnerMenu(article) {
        return [ {
            itemFmt : 'fa fa-thumbs-up txt-color-green',
            itemText: this.state.favorite ?
            Lang.translate("Not Favorite") :
            Lang.translate("Mark Favorite"),
            itemHandler: function() {
                this._toggleFavorite();
            }.bind(this)
        }, {
            itemFmt : 'fa fa-circle txt-color-red',
            itemText: 'Delete Post',
            itemHandler: function(e, pane) {
                e.stopPropagation();
                this.refs.modal.openModal();
            }.bind(this)
        }, {
            itemFmt : 'fa fa-pencil-square-o txt-color-green',
            itemText: 'Edit Post',
            itemHandler: function() {
                this._editArticle();
            }.bind(this)
        } ];
    }

    _getAdminMenu(article) {
        let adminItem = null;

        if (this.state.publish === true) {
            adminItem = [ {
                itemFmt : 'fa fa-check txt-color-green',
                itemText: 'Withdraw Publishing Post',
                itemHandler: function(e, pane) {
                    this.setState({
                        publish: false
                    });
                }.bind(this)
            } ];
        } else {
            adminItem = [ {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Publish Post',
                itemHandler: function(e, pane) {
                    e.preventDefault();
                    this.setState({
                        publish: true
                    });
                    this.refs.publish.openModal();
                }.bind(this)
            } ];
        }  
        return adminItem;
    }

    render() {
        const fmt = "btn btn-primary pull-right";
        let content, imgs, adminItem = null, ownerItem = null, panelLabel = null,
            modal, publishModal, ownerPostMenu, refLink = null,
            article = this.state.article, pictures = null, tagPost = null;

        if (article.noData === true) {
            tagPost = article.requestData();
        }
        if (tagPost == null) {
            tagPost = <TagPost article={article} notifyId={this._postPaneId}/>;
        }
        modal = (
            <ModalConfirm ref="modal" height="auto"
                modalTitle="Delete this article post?">
                <div className="modal-footer">
                    <button className={fmt}
                        onClick={this._deletePost.bind(this, article)}>
                        <Mesg text="OK Delete"/>
                    </button>
                    <button className={fmt} onClick={this._cancelDel}>
                        <Mesg text="Cancel"/>
                    </button>
                </div>
            </ModalConfirm>
        );
        publishModal = (
            <ModalConfirm ref="publish" height="auto" modalTitle="Publish Article">
                <PublishArticle article={article} doneFn={this._donePublish}/>
            </ModalConfirm>
        );
        ownerPostMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: Lang.translate('Options'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: Lang.translate('Tag Post'),
                itemHandler: function() {
                }
            } ]
        };

        if (this.state.editMode === true && article.noData == null) {
            return <EditorPost article={article}/>
        }
        if (UserStore.amIAdmin() == true) {
            adminItem = this._getAdminMenu(article);
        }
        if (UserStore.isUserMe(article.authorUuid)) {
            ownerItem = this._getOwnerMenu(article);
        } else {
            refLink = (
                <RefLinks article={article} edit={false} notifyId={this._postPaneId}/>
            );
        }
        if (ownerItem != null) {
            Array.prototype.push.apply(ownerPostMenu.menuItems, ownerItem);
        }
        if (adminItem != null) {
            Array.prototype.push.apply(ownerPostMenu.menuItems, adminItem);
        }
        panelLabel = [ {
            labelIcon: 'label label-success',
            labelText: article.moneyEarned
        }, {
            labelIcon: 'label label-warning',
            labelText: article.creditEarned
        } ];
        if (this.state.favorite === true) {
            panelLabel.push({
                labelIcon: 'label label-primary',
                labelText: Lang.translate('Fav')
            });
        }
        if (this.state.publish === true) {
            panelLabel.push({
                labelIcon: 'label label-info',
                labelText: Lang.translate('Public')
            });
        }
        const panelData = {
            icon   : 'fa fa-book',
            header : Util.toDateString(article.createdDate),
            headerMenus: [ownerPostMenu],
            panelLabel : panelLabel
        };
        content = (
            <div style={VntdGlob.styleContent}
                dangerouslySetInnerHTML={this._rawMarkup(article)}/>
        );
        imgs = article.pictureUrl;
        if (imgs != null) {
            if (imgs.length == 1) {
                pictures = <PostItem style={VntdGlob.styleImg} data={imgs}/>
            } else {
                pictures = <PostItem data={imgs}/>
            }
        }
        content = (
            <div>
                {ArticleBox.youtubeLink(article, false)}
                {pictures}
                {content}
            </div>
        );
        return (
            <Panel className="well no-padding" context={panelData}>
                {tagPost}
                <p className="hidden-xs hidden-sm" style={{fontSize: "140%"}}>
                    {article.articleUrl}
                </p>
                {refLink}
                {modal}
                {publishModal}
                {content}
                {refLink}
                <PostComment articleUuid={article.articleUuid}/>
            </Panel>
        )
    }
}

export default PostPane;
