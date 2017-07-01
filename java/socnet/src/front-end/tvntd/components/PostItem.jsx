/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import Modal         from 'react-modal';

import TextOverImg   from 'vntd-shared/layout/TextOverImg.jsx';
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
        const fmt = "col-xs-6 col-sm-6 col-md-6 col-lg-6 no-padding";
        let modal, pic2, pic3, pic4, pic5, text, picList = this.props.data, picOut = [];

        if (picList == null) {
            return null;
        }
        modal = (
            <Modal style={modalStyle}
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this._afterOpenModal}
                onRequestClose={this._closeModal}>

                <div className="form-group alert">
                    <a className="close" aria-label="close"
                        onClick={this._closeModal}>x</a>
                </div>
                <ImageCarousel imageList={picList} select={this.state.imageSelected}/>
             </Modal>
        );
        if (picList.length >= 1) {
            picOut.push(
                <div key={_.uniqueId("post-item-")} className={fmt}>
                    <a onClick={this._openModal.bind(this, "0")}>
                        <img className='img-responsive' src={picList[0]}/>
                    </a>
                </div>
            );
        }
        if (picList.length >= 2) {
            pic2 = (
                <a onClick={this._openModal.bind(this, "1")}>
                    <img className='img-responsive' src={picList[1]}/>
                </a>
            );
            if (picList.length >= 3) {
                pic3 = (
                    <a onClick={this._openModal.bind(this, "2")}>
                        <img className='img-responsive' src={picList[2]}/>
                    </a>
                );
            } else {
                pic3 = null;
            }
            if (picList.length >= 4) {
                pic4 = (
                    <a onClick={this._openModal.bind(this, "3")}>
                        <img className='img-responsive' src={picList[3]}/>
                    </a>
                );
            } else {
                pic4 = null;
            }
            if (picList.length >= 5) {
                text = "+" + picList.length.toString();
                pic5 = (
                    <a onClick={this._openModal.bind(this, "4")}>
                        <TextOverImg className='img-responsive'
                            imgUrl={picList[4]} text={text}/>
                    </a>
                );
            } else {
                pic5 = null;
            }
            picOut.push(
                <div key={_.uniqueId("post-item-")} className={fmt}>
                    <div className="row">
                        <div className={fmt}>
                            {pic2}
                            {pic3}
                        </div>
                        <div className={fmt}>
                            {pic4}
                            {pic5}
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
