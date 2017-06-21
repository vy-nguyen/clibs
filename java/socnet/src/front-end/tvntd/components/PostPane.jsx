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
import Mesg         from 'vntd-root/components/Mesg.jsx'
import PostItem     from 'vntd-root/components/PostItem.jsx';
import RefLinks     from 'vntd-root/components/RefLinks.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import ModalConfirm from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import EditorPost   from 'vntd-shared/forms/commons/EditorPost.jsx';
import InputStore   from 'vntd-shared/stores/NestableStore.jsx'; 

import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';
import { InputInline }  from 'vntd-shared/forms/commons/GenericForm.jsx';

class TagPost extends React.Component
{
    constructor(props) {
        let btnId = "chg-tag-" + props.articleUuid;
        super(props);
        this.state = {
            buttonId: btnId
        };
        this._onBlur = this._onBlur.bind(this);
        this._submitUpdate  = this._submitUpdate.bind(this);
        this._getSavedInfo  = this._getSavedInfo.bind(this);
        this._updateSuccess = this._updateSuccess.bind(this);
        this._createUpdateBtn  = this._createUpdateBtn.bind(this);
        this._onOptionSelected = this._onOptionSelected.bind(this);

        StateButtonStore.createButton(btnId, this._createUpdateBtn);
    }

    _onBlur(val) {
        this._onOptionSelected(val.target.value);
    }

    _onOptionSelected(val) {
        let postInfo = this._getSavedInfo();
        postInfo.tagName = val;
    }

    _submitUpdate(btnId) {
        let artRank, artUuid = this.props.articleUuid, postInfo = this._getSavedInfo(),
        tagInfo = {
            tagName    : postInfo.tagName,
            favorite   : this.state.favorite,
            userUuid   : this.props.authorUuid,
            title      : this.refs.title.value,
            likeInc    : 0,
            shareInc   : 0,
            articleUuid: artUuid,
            cbButtonId : btnId,
            prevArticle: InputStore.getItemIndex(RefLinks.getPrevRefArtId(artUuid)),
            nextArticle: InputStore.getItemIndex(RefLinks.getNextRefArtId(artUuid))
        };
        console.log("Submit update ");
        console.log(tagInfo);

        if (!_.isEmpty(this.refs.title.value)) {
            postInfo.title = this.refs.title.value;
        }
        StateButtonStore.getButtonState(btnId).setNextState();
        artRank = AuthorStore.getArticleRank(this.props.authorUuid,
                                             this.props.articleUuid);
        AuthorStore.updateAuthorTag(tagInfo, artRank);
    }

    _updateSuccess(btnId, prev, curr) {
    }

    _createUpdateBtn() {
        let artRank = AuthorStore
            .getArticleRank(this.props.authorUuid, this.props.articleUuid);
        return {
            success: {
                text     : Lang.translate("Update"),
                disabled : false,
                nextState: "updating",
                className: "btn btn-primary",
                triggerFn: this._updateSuccess
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
            },
            savedInfo: {
                artRank  : artRank,
                tagName  : artRank != null ?
                    artRank.tagName : Lang.translate("My Post"),
                title    : this.props.artTitle
            }
        };
    }

    _getSavedInfo() {
        return StateButtonStore.getButtonStateKey(this.state.buttonId, "savedInfo");
    }

    render() {
        let btnId = this.state.buttonId,
            postInfo = this._getSavedInfo(),
            allTags = AuthorStore.getTagsByAuthorUuid(this.props.authorUuid);

        return (
            <form enclType="form-data"
                acceptCharset="utf-8" className="form-horizontal">
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <TA.Typeahead options={allTags} maxVisible={6}
                            placeholder={postInfo.tagName} value={postInfo.tagName}
                            customClasses={{input: "form-control input-sm"}}
                            onBlur={this._onBlur}
                            onOptionSelected={this._onOptionSelected}/>
                    </div>
                    <StateButton btnId={btnId}
                        onClick={this._submitUpdate.bind(this, btnId)}/>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <input className="form-control input-lg"
                            ref="title" placeholder={postInfo.title}/>
                    </div>
                </div>
            </form>
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

class PostPane extends React.Component {

    constructor(props) {
        let artRank = AuthorStore.getArticleRank(props.data.authorUuid,
                                                 props.data.articleUuid);
        super(props);
        if (artRank != null) {
            if (artRank.publishPost == null) {
                artRank.publishPost = false;
            }
            this.state = {
                artRank : artRank,
                favorite: artRank.favorite,
                publish : artRank.publishPost
            }
        } else {
            this.state = {
                artRank : {},
                favorite: false,
                publish : false,
                editMode: false
            }
        }
        if (ArticleTagStore.hasPublishedArticle(props.data.articleUuid)) {
            this.state.publish = true;
        }
        this._deletePost     = this._deletePost.bind(this);
        this._cancelDel      = this._cancelDel.bind(this);
        this._editArticle    = this._editArticle.bind(this);
        this._toggleFavorite = this._toggleFavorite.bind(this);
        this._donePublish    = this._donePublish.bind(this);
        this._updateState    = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
    }

    _rawMarkup() {
        return { __html: this.props.data.content };
    }

    _deletePost() {
        Actions.deleteUserPost({
            authorUuid: UserStore.getSelfUuid(),
            uuidType  : "article",
            uuids     : [ this.props.data.articleUuid ]
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
    }

    _donePublish() {
        this.refs.publish.closeModal();
    }

    _editArticle() {
        this.setState({
            editMode: true
        });
    }

    render() {
        const fmt = "btn btn-primary pull-right";
        let adminItem = null, ownerItem = null, tagPost = null, panelLabel = null,
            article = this.props.data,
        modal = (
            <ModalConfirm ref="modal" height="auto"
                modalTitle="Delete this article post?">
                <div className="modal-footer">
                    <button className={fmt} onClick={this._deletePost}>
                        <Mesg text="Delete"/>
                    </button>
                    <button className={fmt} onClick={this._cancelDel}>
                        <Mesg text="Cancel"/>
                    </button>
                </div>
            </ModalConfirm>
        ),
        publishModal = (
            <ModalConfirm ref="publish" height="auto" modalTitle="Publish Article">
                <PublishArticle article={article} doneFn={this._donePublish}/>
            </ModalConfirm>
        );

        if (this.state.editMode === true) {
            return <EditorPost article={article}/>
        }
        if (UserStore.amIAdmin() == true) {
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
        }
        if (UserStore.isUserMe(article.authorUuid)) {
            ownerItem = [ {
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
        let ownerPostMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: Lang.translate('Options'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-thumbs-up txt-color-green',
                itemText: this.state.favorite ?
                    Lang.translate("Not Favorite") :
                    Lang.translate("Mark Favorite"),
                itemHandler: function() {
                    this._toggleFavorite();
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: Lang.translate('Tag Post'),
                itemHandler: function() {
                }
            } ]
        };
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
            header : toDateString(article.createdDate),
            headerMenus: [ownerPostMenu],
            panelLabel : panelLabel
        };
        const divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        if (UserStore.isUserMe(article.authorUuid)) {
            tagPost = (
                <TagPost articleUuid={article.articleUuid}
                    artTitle={article.topic} authorUuid={article.authorUuid}/>
            );
        } else {
            tagPost = <h2>{article.topic ? article.topic : Lang.translate("My Post")}</h2>
        }
        return (
            <Panel className="well no-padding" context={panelData}>
                <div style={{fontSize: "120%"}}>
                    {article.articleUrl}
                </div>
                {tagPost}
                {modal}
                {publishModal}
                <PostItem data={article.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <RefLinks article={article}/>
                <PostComment articleUuid={article.articleUuid}/>
            </Panel>
        )
    }
}

export default PostPane;
