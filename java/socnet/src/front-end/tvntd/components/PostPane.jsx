/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React        from 'react-mod';
import _            from 'lodash';
import TA           from 'react-typeahead';

import Actions      from 'vntd-root/actions/Actions.jsx';
import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';

const tags = [
    "Kinh te", "Chinh tri", "Viet Nam", "Giao duc"
];

let TagPost = React.createClass({

    onOptionSelected: function(val) {
        console.log("Select option");
        console.log(val);
    },

    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6">
                    <TA.Typeahead options={['Kinh te', 'Chinh tri', 'Viet Nam', 'Giao duc']} maxVisible={2}
                        placeholder={"Tag your article"}
                        customClasses={{input: "form-control input-sm"}}
                        onOptionSelected={this.onOptionSelected}/>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6">
                    <input name="rank" ref="rank" className="form-control input-sm" placeholder="Rank your post"/>;
                </div>
            </div>
        );
    }
});

let PostPane = React.createClass({

    _rawMarkup: function() {
        return { __html: this.props.data.content };
    },

    render: function() {
        let ownerPostMenu = {
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
        let panelData = {
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
        let divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        let tagPost = null;
        if (UserStore.isUserMe(this.props.data.authorUuid)) {
            tagPost = <TagPost/>
                //<input name="tag" ref="tag" className="form-control input-sm" placeholder="Tag your post"/>;
        }
        return (
            <Panel className="well no-padding" context={panelData}>
                {tagPost}
                <h2>{this.props.data.topic ? this.props.data.topic : "Post"}</h2>
                <PostItem data={this.props.data.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <PostComment articleUuid={this.props.data.articleUuid}/>
            </Panel>
        )
    }
});

export default PostPane;
