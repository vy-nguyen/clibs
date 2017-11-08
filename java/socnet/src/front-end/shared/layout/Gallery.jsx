/**
 * Vy Nguyen (2016)
 * BSD License
 */
import _             from 'lodash';
import React         from 'react';
import Modal         from 'react-modal';

import {VntdGlob}    from 'vntd-root/config/constants.js';
import ImageCarousel from 'vntd-shared/layout/ImageCarousel.jsx';

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
        this._closeModal = this._closeModal.bind(this);
    }

    _openModal(idx, e) {
        e.preventDefault();
        this.setState({
            imageSelected: idx || "0",
            modalIsOpen  : true
        });
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
        let modal = (
            <Modal style={VntdGlob.styleModal}
                isOpen={this.state.modalIsOpen}
                onRequestClose={this._closeModal}>

                <div className="form-group alert ">
                    <a className="close"
                        aria-label="close" onClick={this._closeModal}>x</a>
                </div>
                <ImageCarousel imageList={this.props.imageList}
                    select={this.state.imageSelected}/>
            </Modal>
        ),
        images = [];
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
