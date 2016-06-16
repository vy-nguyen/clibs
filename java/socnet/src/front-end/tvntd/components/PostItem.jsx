/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import _     from 'lodash';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

import ImageCarousel from 'vntd-shared/layout/ImageCarousel.jsx';

let PostItem = React.createClass({

    getInitialState: function() {
        return {
            imageSelected : "0",
            isShowingModal: false
        }
    },

    _handleClick: function(idx, e) {
        e.preventDefault();
        this.setState({
            imageSelected: idx ? idx : "0",
            isShowingModal: true
        });
    },

    _handleClose: function() {
        this.setState({
            isShowingModal: false
        });
    },

    render: function() {
        let pic_lst = this.props.data;
        if (!pic_lst) {
            return null;
        }
        let modal = (this.state.isShowingModal &&
            <ModalContainer onClose={this._handleClose}>
                <ModalDialog onClose={this._handleClose}>
                    <ImageCarousel imageList={pic_lst} select={this.state.imageSelected}/>
                </ModalDialog>
            </ModalContainer>
        );
        let pic_out = [];
        if (pic_lst.length >= 1) {
            pic_out.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <a onClick={this._handleClick.bind(this, "0")}>
                        <img className='img-responsive' src={pic_lst[0]}/>
                    </a>
                </div>
            );
        }
        if (pic_lst.length >= 2) {
            pic_out.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-6">
                            <a onClick={this._handleClick.bind(this, "1")}>
                                <img className='img-responsive' src={pic_lst[1]}/>
                            </a>
                            <br/>
                            {
                                pic_lst.length >= 3 ?
                                <a onClick={this._handleClick.bind(this, "2")}>
                                    <img className='img-responsive' src={pic_lst[2]}/>
                                </a> : null
                            }
                        </div>
                        <div className="col-sm-6">
                            {
                                pic_lst.length >= 4 ?
                                <a onClick={this._handleClick.bind(this, "3")}>
                                    <img className='img-responsive' src={pic_lst[3]}/>
                                </a> : null
                            }
                            <br/>
                            {
                                pic_lst.length >= 5 ?
                                <a onClick={this._handleClick.bind(this, "4")}>
                                    <img className='img-responsive' src={pic_lst[4]}/>
                                </a> : null
                            }
                        </div> 
                    </div>
                </div>
            );
        }
        return (
            <div className="post">
                <div className="row margin-bottom">
                    {pic_out}
                    {modal}
                </div>
            </div>
        )
    }
});

export default PostItem;
