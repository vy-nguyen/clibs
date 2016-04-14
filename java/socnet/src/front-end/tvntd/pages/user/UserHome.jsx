/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import WidgetGrid         from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget       from 'vntd-shared/widgets/JarvisWidget.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';

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
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="box box-info">
                            <div className="box-header">
                                <div className="pull-right box-tools">
                                    <button className="btn btn-info btn-sm" data-widget="collapse" data-toggle="tooltip" title="Collapse">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                    <button className="btn btn-info btn-sm" data-widget="remove" data-toggle="tooltip" title="Remove">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="box-body pad">
                                <form>
                                    <textarea style={{opacity: 0}} id="my-post" name="mypost" rows={20} cols={120}>
                                    </textarea>
                                </form>
                                <button className="btn btn-primary margin-top-10 pull-right">Post</button>
                                <button className="btn btn-primary margin-top-10 pull-right">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default UserHome;
