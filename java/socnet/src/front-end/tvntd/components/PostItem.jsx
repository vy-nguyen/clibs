/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import _     from 'lodash';

let PostItem = React.createClass({

    render: function() {
        let pic_lst = this.props.data;
        if (!pic_lst) {
            return null;
        }
        let pic_out = [];
        if (pic_lst.length >= 1) {
            pic_out.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <img className='img-responsive' src={pic_lst[0]}/>
                </div>
            );
        }
        if (pic_lst.length >= 2) {
            pic_out.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-6">
                            <img className='img-responsive' src={pic_lst[1]}/>
                            <br/>
                            {pic_lst.length >= 3 ? <img className='img-responsive' src={pic_lst[2]}/> : null}
                        </div>
                        <div className="col-sm-6">
                            {pic_lst.length >= 4 ? <img className='img-responsive' src={pic_lst[3]}/> : null}
                            <br/>
                            {pic_lst.length >= 5 ? <img className='img-responsive' src={pic_lst[4]}/> : null}
                        </div> 
                    </div>
                </div>
            );
        }
        return (
            <div className="post">
                <div className="row margin-bottom">
                    {pic_out}
                </div>
            </div>
        )
    }
});

export default PostItem;
