/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Reflux              from 'reflux';

import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import MarkdownEditor      from 'vntd-shared/forms/editors/MarkdownEditor.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import UserAvatar          from './UserAvatar.jsx';

let UserHome = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    render: function() {
        let self = UserStore.getSelf();
        if (self == null) {
            return null;
        }
        let imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];
        return (
            <div id="user-home">
                <ProfileCover data={{imageId: self._id, imageList: imgList}}/>
                <UserAvatar data={{doFileDrop: false}}/>
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-6">
                        <JarvisWidget id="my-post" color="purple">
                            <header><span className="widget-icon"> <i className="fa fa-pencil"/>  </span>
                                <h2>Publish Post</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <MarkdownEditor className="custom-scroll" height={470}/>
                                    <button className="btn btn-primary margin-top-10 pull-right">Post</button>
                                    <button className="btn btn-primary margin-top-10 pull-right">Save</button>
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
            </div>
        )
    }
});

export default UserHome;
