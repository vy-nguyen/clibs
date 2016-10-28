/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import GenericForm     from 'vntd-shared/forms/commons/GenericForm.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';

let TagInfo = React.createClass({

    _removeSelf: function() {
        ArticleTagStore.removePublicTag(this.props.artTag.tagName);
    },

    _removeSub: function(tag, sub) {
        ArticleTagStore.removePublicTag(sub.tagName);
    },

    _addNewTag: function(data) {
        ArticleTagStore.addTagInput(data);
    },

    _selectParent: function(select) {
        ArticleTagStore.changeParent(this.props.artTag.tagName, select);
    },

    _submitChange: function(data) {
        console.log("Submit change tag info");
        console.log(data);
        let name = ArticleTagStore.changeTagValue(data);
        console.log(ArticleTagStore.getPublicTag(name));
    },

    render: function() {
        let artTag = this.props.artTag;

        if (artTag == null) {
            let labelFmt = "col-sm-4 col-md-4 col-lg-4 control-label";
            let inputFmt = "col-sm-8 col-md-8 col-lg-8 control-label";
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
        let subTags = [];
        _.forEach(artTag.subTags, function(tag) {
            subTags.push(
                <li key={_.uniqueId('sub-tag-')}>
                    <a onClick={this._removeSub.bind(this, artTag, tag)}>
                        <span className="label label-info" style={{fontSize: 14}}> x {tag.tagName}</span>
                    </a>
                </li>
            );
        }.bind(this));

        let taTags = [];
        let parentTags = [];
        _.forOwn(ArticleTagStore.getAllPublicTags(false), function(tag) {
            taTags.push(tag.tagName);
            parentTags.push({ value: tag.tagName, label: tag.tagName });
        });

        let labelFmt = "col-sm-3 col-md-3 col-lg-3 control-label";
        let inputFmt = "col-sm-9 col-md-9 col-lg-9 control-label";
        let tagValForm = {
            formFmt  : "smart-form client-form",
            formEntries: [ {
                legend : "Modify tag values",
                entries: [ {
                    labelFmt: labelFmt,
                    labelTxt: "Parent",
                    inpName : "parent",
                    inputFmt: inputFmt,
                    inpHolder: artTag.parentTag,
                    select   : true,
                    selectOpt: parentTags
                }, {
                    labelFmt: labelFmt,
                    labelTxt: "Rank",
                    inpName : "rank",
                    inputFmt: inputFmt,
                    inpHolder: artTag.rankScore
                }, {
                    labelFmt: labelFmt,
                    labelTxt: "Name",
                    inpName : "tagName",
                    inputFmt: "col-sm-8 col-md-8 col-lg-8 control-label",
                    inpHolder: artTag.tagName,
                    typeAhead: true,
                    taOptions: taTags
                } ]
            } ],
            buttons: [ {
                btnFmt : "btn btn-primary",
                btnText: "Submit",
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
                <span><h4><a onClick={this._removeSelf}> x </a>{artTag.tagName}</h4></span>
                <ul className="list-inline padding-10">
                    {subTags}
                </ul>
            </div>
        );
    }
});

export default TagInfo;
