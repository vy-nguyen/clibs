/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import Modal         from 'react-modal';

import ImageCarousel from 'vntd-shared/layout/ImageCarousel.jsx';

const modalStyle = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)'
    }
};

class PostItem extends React.Component
{
    constructor(props) {
        super(props);
        this._openModal      = this._openModal.bind(this);
        this._closeModal     = this._closeModal.bind(this);
        this._afterOpenModal = this._afterOpenModal.bind(this);

        this.state = {
            imageSelected: "0",
            modalIsOpen  : false
        }
    }

    _openModal(idx, e) {
        e.preventDefault();
        this.setState({
            imageSelected: idx ? idx : "0",
            modalIsOpen  : true
        });
    }

    _afterOpenModal() {
    }

    _closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        let picList = this.props.data;
        if (!picList) {
            return null;
        }
        let modal = (
            <Modal style={modalStyle}
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this._afterOpenModal}
                onRequestClose={this._closeModal}>

                <div className="form-group alert">
                    <a className="close" aria-label="close" onClick={this._closeModal}>x</a>
                </div>
                <ImageCarousel imageList={picList} select={this.state.imageSelected}/>
             </Modal>
        );
        let picOut = [];
        if (picList.length >= 1) {
            picOut.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <a onClick={this._openModal.bind(this, "0")}>
                        <img className='img-responsive' src={picList[0]}/>
                    </a>
                </div>
            );
        }
        if (picList.length >= 2) {
            picOut.push(
                <div key={_.uniqueId("post-item-")} className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-6">
                            <a onClick={this._openModal.bind(this, "1")}>
                                <img className='img-responsive' src={picList[1]}/>
                            </a>
                            <br/>
                            {
                                picList.length >= 3 ?
                                <a onClick={this._openModal.bind(this, "2")}>
                                    <img className='img-responsive' src={picList[2]}/>
                                </a> : null
                            }
                        </div>
                        <div className="col-sm-6">
                            {
                                picList.length >= 4 ?
                                <a onClick={this._openModal.bind(this, "3")}>
                                    <img className='img-responsive' src={picList[3]}/>
                                </a> : null
                            }
                            <br/>
                            {
                                picList.length >= 5 ?
                                <a onClick={this._openModal.bind(this, "4")}>
                                    <img className='img-responsive' src={picList[4]}/>
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
                    {picOut}
                    {modal}
                </div>
            </div>
        )
    }
}

export default PostItem;
