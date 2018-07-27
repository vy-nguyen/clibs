/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import GenericForm     from 'vntd-shared/forms/commons/GenericForm.jsx';
import InputStore      from 'vntd-shared/stores/NestableStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';

const tagKinds = [
    { value: "edu",       label: Lang.translate("Education") },
    { value: "ads",       label: Lang.translate("Advertising") },
    { value: "estore",    label: Lang.translate("E-Store") },
    { value: "blog",      label: Lang.translate("Blog Post") },
    { value: "news",      label: Lang.translate("News Post") }
];

class TagInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._removeSelf   = this._removeSelf.bind(this);
        this._removeSub    = this._removeSub.bind(this);
        this._addNewTag    = this._addNewTag.bind(this);
        this._selectParent = this._selectParent.bind(this);
        this._submitChange = this._submitChange.bind(this);
    }

    _removeSelf() {
        ArticleTagStore.removePublicTag(this.props.artTag.tagName);
    }

    _removeSub(tag, sub) {
        ArticleTagStore.removePublicTag(sub.tagName);
    }

    _addNewTag(data) {
        ArticleTagStore.addTagInput(data);
    }

    _selectParent(select) {
        ArticleTagStore.changeParent(this.props.artTag.tagName, select);
    }

    _submitChange(data) {
        ArticleTagStore.changeTagValue(data);
    }

    render() {
        let subTags, taTags, parentTags, tagName, labelFmt, inputFmt, tagValForm,
            artTag = this.props.artTag;

        if (artTag == null) {
            labelFmt = "col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label";
            inputFmt = "col-xs-8 col-sm-8 col-md-8 col-lg-8 control-label";
            let tagForm = {
                formFmt   : "smart-form client-form",
                hiddenHead: null,
                hiddenTail: null,
                formEntries: [ {
                    legend: "Enter new tag",
                    entries: [ {
                        labelFmt: labelFmt,
                        labelTxt: "Parent tag",
                        inpName : "parentTag",
                        inputFmt: inputFmt,
                        inpHolder: null
                    }, {
                        labelFmt : labelFmt,
                        labelTxt : "Kind",
                        inpName  : "tagKind",
                        inputFmt : inputFmt,
                        inpHolder: "blog",
                        select   : true,
                        selectOpt: tagKinds
                    }, {
                        labelFmt: labelFmt,
                        labelTxt: "Tag name",
                        inpName : "tagName",
                        inputFmt: inputFmt,
                        inpHolder: null
                    }, {
                        labelFmt: labelFmt,
                        labelTxt: "Tag rank",
                        inpName : "rankScore",
                        inputFmt: inputFmt,
                        inpHolder: null
                    } ]
                } ],
                buttons: [ {
                    btnFmt : "btn btn-primary",
                    btnText: "Add Tag",
                    onClick: function(data) {
                        this._addNewTag(data);
                    }.bind(this)
                } ]
            };
            return (
                <div className="well well-sm">
                    <GenericForm form={tagForm}/>
                </div>
            );
        }
        subTags = [];
        _.forEach(artTag.subTags, function(tag) {
            subTags.push(
                <li key={_.uniqueId('sub-tag-')}>
                    <a onClick={this._removeSub.bind(this, artTag, tag)}>
                        <span className="label label-info" style={{fontSize: 14}}>
                            x {tag.tagName}
                        </span>
                    </a>
                </li>
            );
        }.bind(this));

        taTags = [];
        parentTags = [];
        _.forOwn(ArticleTagStore.getAllPublicTags(false), function(tag) {
            taTags.push(tag.tagName);
            parentTags.push({
                value: tag.tagName,
                label: tag.tagName
            });
        });

        tagName = artTag.tagName;
        labelFmt = "col-sm-3 col-md-3 col-lg-3 control-label";
        inputFmt = "col-sm-9 col-md-9 col-lg-9 control-label";
        tagValForm = {
            formFmt  : "smart-form client-form",
            formEntries: [ {
                legend : Lang.translate("Modify tag values"),
                entries: [ {
                    labelFmt: labelFmt,
                    labelTxt: Lang.translate("Parent"),
                    inputFmt: inputFmt,
                    inpHolder: artTag.parentTag,
                    select   : true,
                    inpName  : "tag-parent-" + tagName,
                    selectOpt: parentTags
                }, {
                    labelFmt : labelFmt,
                    labelTxt : Lang.translate("Kind"),
                    inputFmt : inputFmt,
                    inpHolder: artTag.tagKind,
                    select   : true,
                    inpName  : "tag-sel-kind-" + tagName,
                    selectOpt: tagKinds
                }, {
                    labelFmt: labelFmt,
                    labelTxt: Lang.translate("Rank"),
                    inpName : "rank-" + tagName,
                    inputFmt: inputFmt,
                    inpHolder: artTag.rankScore
                }, {
                    labelFmt : labelFmt,
                    labelTxt : Lang.translate("Name"),
                    inputFmt : "col-sm-8 col-md-8 col-lg-8 control-label",
                    inpHolder: artTag.tagName,
                    typeAhead: true,
                    inpName  : "tag-typeahead-" + tagName,
                    taOptions: taTags
                } ]
            } ],
            buttons: [ {
                btnFmt : "btn btn-primary",
                btnText: Lang.translate("Submit"),
                onClick: function(data) {
                    data.curTag = artTag.tagName;
                    this._submitChange(data);
                }.bind(this)
            } ]
        };
        return (
            <div className="well well-sm">
                <GenericForm form={tagValForm}/>
                <hr/>
                <span>
                    <h4>
                        <a onClick={this._removeSelf}> x </a>
                        {artTag.tagName}
                    </h4>
                </span>
                <ul className="list-inline padding-10">
                    {subTags}
                </ul>
            </div>
        );
    }
}

export { tagKinds };
export default TagInfo;
