/**
 * Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import Actions         from 'vntd-root/actions/Actions.jsx';
import ErrorView       from 'vntd-shared/layout/ErrorView.jsx';
import ArticleBase     from 'vntd-shared/layout/ArticleBase.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore      from 'vntd-shared/stores/ErrorStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import DynamicTable    from 'vntd-root/components/DynamicTable.jsx';

class ListUserTags extends React.Component
{
    constructor(props) {
        super(props);
        this._deleteRows    = this._deleteRows.bind(this);
        this._submitDelete  = this._submitDelete.bind(this);
        this._submitChanges = this._submitChanges.bind(this);

        this.footer = [ {
            format: "btn btn-primary pull-right",
            title : "Save Changes",
            onSubmit: this._submitChanges
        }, {
            format: "btn btn-danger pull-right",
            title : "Delete Selected Rows",
            onSubmit: this._deleteRows
        }, {
            format: "btn btn-danger pull-right",
            title : "Delete Tag!",
            onSubmit: this._submitDelete
        } ];
        this.tabHeader = [ {
            key   : "artTag",
            format: "",
            header: Lang.translate("Kind")
        }, {
            key   : "tagSelect",
            format: "",
            header: Lang.translate("Change Tag")
        }, {
            key   : "artTitle",
            format: "",
            header: Lang.translate("Article Title")
        }, {
            key   : "contentBrief",
            format: "fa fa-book",
            header: Lang.translate("Summarized")
        }, {
            key   : "rank",
            format: "",
            header: Lang.translate("Rank Order")
        } ];
    }

    _getErrorId() {
        return this.props.authorTag.tagName + "-error";
    }

    _submitChanges(changes) {
        console.log("submit changes");
        console.log(changes);
        if (_.isEmpty(changes)) {
            ErrorStore.reportErrMesg(this._getErrorId(),
                "You don't have any changed data", null);
            return false;
        }
        let artRanks = [], authorTag = this.props.authorTag,
        cmd = {
            tagRanks: null,
            userUuid: UserStore.getSelfUuid(),
            artList : [ {
                tagName : authorTag.tagName,
                artUuid : null,
                artRanks: artRanks
            } ]
        };
        _.forEach(changes, function(it) {
            artRanks.push({
                order  : it.rank,
                tagName: it.tagSelect,
                artUuid: it.articleUuid
            });
        });
        console.log(cmd);
        console.log(authorTag);
        Actions.commitTagRanks(authorTag.getMyTagMgr(), cmd);
        return true;
    }

    _submitDelete(changes) {
        let authorTag = this.props.authorTag,
            sortedArts = authorTag.getSortedArticleRank();

        console.log("submit delete table");
        console.log(changes);
        if (!_.isEmpty(sortedArts)) {
            ErrorStore.reportErrMesg(this._getErrorId(),
                "You need to move or delete articles in this table", null);
            return false;
        }
        return true;
    }

    _deleteRows(changes) {
        let cmd, authorTag = this.props.authorTag;

        if (_.isEmpty(changes)) {
            ErrorStore.reportErrMesg(this._getErrorId(),
                "You don't have any rows to delete", null);
            return false;
        }
        cmd = {
            uuids     : [],
            uuidType  : "article",
            authorUuid: UserStore.getSelfUuid()
        };
        _.forEach(changes, function(it) {
            cmd.uuids.push(it.articleUuid);
        });
        Actions.deleteUserPost(cmd);
        return true;
    }

    _getTableData(sortedArts, authorTag, tagSelect) {
        let tagName, data = [];

        _.forOwn(sortedArts, function(brief) {
            tagName = authorTag.tagName;
            data.push({
                rowId    : _.uniqueId(tagName),
                artTag   : brief.artTag,
                artTitle : brief.artTitle,
                tagSelect: {
                    select   : true,
                    inpHolder: tagName,
                    inpDefVal: tagName,
                    selectOpt: tagSelect,
                    inpName  : _.uniqueId()
                },
                rank: {
                    inpValue : brief.rank,
                    inpDefVal: brief.rank,
                    inpHolder: 0,
                    inpName  : _.uniqueId()
                },
                contentBrief: brief.contentBrief,
                articleUuid : brief.getArticleUuid()
            });
        }.bind(this));
        return data;
    }

    render() {
        let authorTag = this.props.authorTag, tagSel = this.props.tagSel,
            sortedArts = authorTag.getSortedArticleRank();

        return (
            <DynamicTable tableFormat={this.tabHeader}
                tableData={this._getTableData(sortedArts, authorTag, tagSel)}
                tableTitle={"Tag: " + authorTag.tagName} edit={false}
                tableFooter={this.footer} cloneRow={null}
                select={true} tableId={'user-tag-' + authorTag.tagName}>
                <ErrorView mesg={true} errorId={this._getErrorId()}/>
            </DynamicTable>
        );
    }
}

class UserTags extends ArticleBase
{
    constructor(props) {
        let self = UserStore.getSelf();

        super(props);
        if (self != null) {
            this.state.self   = self;
            this.state.tagMgr = AuthorStore.getAuthorTagMgr(self.userUuid);
        }
    }

    // @Override
    //
    _updateArts(store, data, status, update, authorUuid) {
        let self = this.state.self;

        if (status === "delOk" && self.userUuid === authorUuid) {
            this.setState({
                tagMgr: AuthorStore.getAuthorTagMgr(self.userUuid)
            });
        }
    }

    _updateAuthor(data, elm, what) {
        console.log("------------- update author ---");
        if (this._hasAuthorUpdate(this.state.self, elm, what) === true) {
            console.log(elm);
            console.log(what);
        }
    }

    render() {
        let tagTab, tagSel, tagMgr = this.state.tagMgr;

        if (tagMgr == null) {
            return null;
        }
        tagSel = tagMgr.getAuthorTagSelect();
        tagTab = _.map(tagMgr.getAuthorTagList(), function(tag) {
            return <ListUserTags authorTag={tag} tagMgr={tagMgr} tagSel={tagSel}/>;
        });
        return (
            <div id="content">
                <section id="widget-grid" className="">
                    {tagTab}
                </section>
            </div>
        );
    }
}

export default UserTags;
