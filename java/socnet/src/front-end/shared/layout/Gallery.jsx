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

class Gallery extends React.Component
{
    static propTypes() {
        return {
            isLoading: React.PropTypes.bool
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            imageSelected: "0",
            modalIsOpen  : false
        };
        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._afterOpenModal = this._afterOpenModal.bind(this);
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
        this.setState({
            modalIsOpen: false
        });
    }

    render() {
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
}

export default Gallery;
