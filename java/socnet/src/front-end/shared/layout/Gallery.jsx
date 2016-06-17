/**
 * Vy Nguyen (2016)
 * BSD License
 */
import _             from 'lodash';
import React         from 'react';
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

let Gallery = React.createClass({

    propTypes: {
        isLoading: React.PropTypes.bool
    },

    _openModal: function(idx, e) {
        e.preventDefault();
        this.setState({
            imageSelected: idx ? idx : "0",
            modalIsOpen  : true
        });
    },

    _afterOpenModal: function() {
    },

    _closeModal: function() {
        this.setState({modalIsOpen: false});
    },

    getInitialState: function() {
        return {
            imageSelected: "0",
            modalIsOpen  : false
        }
    },

    render: function() {
        const {
            props: {
                isLoading
            }
        } = this;
        let modal = 
            <Modal style={modalStyle}
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this._afterOpenModal}
                onRequestClose={this._closeModal}>

                <div className="form-group alert ">
                    <a className="close" aria-label="close" onClick={this._closeModal}>x</a>
                </div>
                <ImageCarousel imageList={this.props.imageList} select={this.state.imageSelected}/>
            </Modal>;

        let images = [];
        _.forEach(this.props.imageList, function(it, idx) {
            images.push(
                <div className="col-md-3" key={_.uniqueId("img-box-")}>
                    <a onClick={this._openModal.bind(this, idx.toString())} title="Image">
                        <img src={it} className="img-responsive"/>
                    </a>
                </div>
            );
        }.bind(this));
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12" >
                        <div className="row gallery-item">
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
