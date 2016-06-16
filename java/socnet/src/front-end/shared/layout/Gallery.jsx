/**
 * Vy Nguyen (2016)
 * BSD License
 */
import _             from 'lodash';
import React         from 'react';
import ReactSpinner  from 'react-spinjs';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

import ImageCarousel from 'vntd-shared/layout/ImageCarousel.jsx';

let Gallery = React.createClass({

    propTypes: {
        isLoading: React.PropTypes.bool
    },

    _handleClick: function(idx, e) {
        e.preventDefault();
        this.setState({
            imageSelected: idx ? idx : "0",
            isShowingModal: true
        });
    },

    _handleClose: function() {
        this.setState({isShowingModal: false});
    },

    getInitialState: function() {
        return {
            imageSelected : "0",
            isShowingModal: false
        }
    },

    render: function() {
        const {
            props: {
                isLoading
            }
        } = this;
        let content = this.props.isLoading ?
            <ReactSpinner/> :
            <ModalDialog onClose={this._handleClose}>
                <ImageCarousel imageList={this.props.imageList} select={this.state.imageSelected}/>
            </ModalDialog>;

        let modal = this.state.isShowingModal &&
            <ModalContainer onClose={this._handleClose}>{content}</ModalContainer>

        let images = [];
        _.forEach(this.props.imageList, function(it, idx) {
            images.push(
                <div className="col-md-3" key={_.uniqueId("img-box-")}>
                    <a onClick={this._handleClick.bind(this, idx.toString())} title="Image"
                        data-lightbox-gallery="gallery1" data-lightbox-hidpi="/rs/img/pattern/pattern.png">
                        <img src={it} className="img-responsive"/>
                    </a>
                </div>
            );
        }.bind(this));
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12" >
                        <div className="row gallery-item" onClick={this._handleClick}>
                            {images}
                            {modal}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Gallery;
