/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import Actions         from 'vntd-root/actions/Actions.jsx';
import DynamicTable    from 'vntd-root/components/DynamicTable.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';

class ListTags extends React.Component
{
    constructor(props) {
        super(props);

        this._convertToReqt = this._convertToReqt.bind(this);
        this._submitChanges = this._submitChanges.bind(this);
        this._selectChanges = this._selectChanges.bind(this);
        this._getTagHeader  = this._getTagHeader.bind(this);
        this._cloneTabRow   = this._cloneTabRow.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);

        this.state = {
            tabData: ArticleTagStore.getTagTableData(true, props.tagKind)
        };
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateArtTags);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateArtTags() {
        this.setState({
            tabData: ArticleTagStore.getTagTableData(true, this.props.tagKind)
        });
    }

    _convertToReqt(changes, out) {
        if (out == null) {
            out = [];
        }
        _.forEach(changes, function(entry) {
            out.push({
                authorUuid : entry.ownerUuid,
                parentTag  : _.isEmpty(entry.parentTag) ? null : entry.parentTag,
                rankScore  : entry.rankScore,
                tagKind    : entry.tagKind,
                tagName    : entry.tagName,
                routeLink  : entry.routeLink,
                imgOid     : entry.imgOid,
                articleRank: entry.articleRank
            });
        });
        return out;
    }

    _submitChanges(changes) {
        let i, tag, mod, reqt;

        reqt = this._convertToReqt(changes);
        ArticleTagStore.addPubListTags(reqt);
        console.log("submit tag changes");
        console.log(reqt);
        Actions.setTags({
            publicTags : reqt,
            deletedTags: []
        });
    }

    _selectChanges(changes) {
        let reqt = this._convertToReqt(changes);

        ArticleTagStore.removePubListTags(reqt);
        Actions.setTags({
            publicTags : [],
            deletedTags: reqt
        });
    }

    _getTagHeader() {
        const tagTab = [ {
            key   : "tagName",
            format: "fa fa-tags",
            header: Lang.translate("Tag Name")
        }, {
            key   : "parentTag",
            format: "fa fa-tags",
            header: Lang.translate("Parent Tag")
        }, {
            key   : "tagKind",
            format: "",
            header: Lang.translate("Tag Kind")
        }, {
            key   : "rankScore",
            format: "fa fa-tags",
            header: Lang.translate("Tag Rank")
        }, {
            key   : "routeLink",
            format: "fa fa-tags",
            header: Lang.translate("Route Link")
        }, {
            key   : "imgOid",
            format: "fa fa-user",
            header: Lang.translate("Image")
        } ];
        return tagTab;
    }

    _cloneTabRow(row, count) {
        return ArticleTagStore.cloneTagTableRow(row, count);
    }

    render() {
        const footer = [ {
            format : "btn btn-primary pull-right",
            title  : "Save Changes",
            onSubmit: this._submitChanges
        }, {
            format : "btn btn-primary pull-right",
            title  : "Delete Selected Rows",
            onSelect: this._selectChanges
        } ];

        return (
            <DynamicTable tableFormat={this._getTagHeader()}
                tableData={this.state.tabData} select={true}
                tableTitle={Lang.translate("Tag Listing")} edit={true}
                tableFooter={footer} cloneRow={this._cloneTabRow}
                tableId={_.uniqueId('tag-list-')}
            />
        );
    }
}

ListTags.propTypes = {
    tagKind: PropTypes.string
};

export default ListTags;
