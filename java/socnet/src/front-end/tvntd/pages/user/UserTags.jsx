/**
 * Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import ArticleBase     from 'vntd-shared/layout/ArticleBase.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import DynamicTable    from 'vntd-root/components/DynamicTable.jsx';

class ListUserTags extends React.Component
{
    constructor(props) {
        super(props);
        this._submitDelete  = this._submitDelete.bind(this);
        this._submitChanges = this._submitChanges.bind(this);

        this.footer = [ {
            format: "btn btn-primary pull-right",
            title : "Save Changes",
            onSubmit: this._submitChanges
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

    _submitDelete(changes) {
        console.log("submit delete");
        console.log(changes);
    }

    _submitChanges(changes) {
    }

    render() {
        let authorTag = this.props.authorTag, tagSel = this.props.tagSel;

        return (
            <DynamicTable tableFormat={this.tabHeader}
                tableData={authorTag.getTagTableData(tagSel)} select={true}
                tableTitle={"Tag: " + authorTag.tagName} edit={false}
                tableFooter={this.footer} cloneRow={null}
                tableId={_.uniqueId('user-tag-')}
            />
        );
    }
}

class UserTags extends ArticleBase
{
    constructor(props) {
        let self;

        super(props);

        self = UserStore.getSelf();
        if (self != null) {
            this.state.self   = self;
            this.state.tagMgr = AuthorStore.getAuthorTagMgr(self.userUuid);
        }
    }

    // @Override
    //
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
