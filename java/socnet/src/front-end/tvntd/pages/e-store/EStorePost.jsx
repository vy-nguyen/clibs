/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import GenericForm      from 'vntd-shared/forms/commons/GenericForm.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';

class EStorePost extends React.Component
{
    constructor(props) {
        super(props);

        this.dropzone = null;
        this._onSend  = this._onSend.bind(this);
        this._dzError = this._dzError.bind(this);
        this._editProduct = this._editProduct.bind(this);
        this._onSaveProduct = this._onSaveProduct.bind(this);

        this._prodDescId   = "prod-desc";
        this._prodSpecId   = "prod-spec";
        this._prodDetailId = "detail-desc";
        this._saveBtnId    = "save-product-btn";
        this._publishBtnId = "publish-product-btn";

        StateButtonStore.createButton(this._saveBtnId, function() {
            return StateButton.saveButtonFsm("Save Later", "Saved Product");
        }); 
        StateButtonStore.createButton(this._publishBtnId, function() {
            return StateButton.saveButtonFsm("Create Product", "Published Product");
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.unsub = null;
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _dzError() {
    }

    _onSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', UserStore.getSelf().userUuid);
    }

    _onSaveProduct(id) {
        console.log("Save product...");
        console.log(id);
    }

    _editProduct() {
        const prodCat = {
            labelTxt : "Categorty",
            inpName  : "prodCat",
            inpHolder: "Category",
        };
        const prodName = {
            labelTxt : "Name",
            inpName  : "prodName",
            inpHolder: "Product Name"
        }
        const prodPrice = {
            labelTxt : "Price",
            inpName  : "prodPrice",
            inpHolder: "Product Price"
        };
        const priceNotice = {
            labelTxt : "Promotion",
            inpName  : "prodNotice",
            inpHolder: "Include shipping"
        };
        const prodDesc = {
            id       : this._prodDescId,
            labelTxt : "Brief description",
            inpName  : "prodDesc",
            editor   : true
        };
        const prodDescDetail = {
            id       : this._prodDetailId,
            labelTxt : "Detail description",
            inpName  : "prodDetail",
            editor   : true
        };
        const prodSpec = {
            id       : this._prodSpecId,
            labelTxt : "Product Specification",
            inpName  : "productSpec",
            editor   : true
        };
        const eventHandlers = {
            sending: this._onSend,
            error  : this._dzError,
            init   : function(dz) {
                this.dropzone = dz;
            }
        };
        const briefDz = {
            defaultMesg: "Drop image here",
            url: "/user/upload-product-img"
        };
        const detailDz = {
            url: "/user/upload-product-detail"
        };

        return (
            <div className="product-content product-wrap clearfix">
                <div className="row">
                    <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                        <div className="row">
                            <div className="container">
                                <h3>Upload icon image</h3>
                                {GenericForm.renderDropzone(briefDz, eventHandlers)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="container">
                                <h3>Upload detail images</h3>
                                {GenericForm.renderDropzone(detailDz, eventHandlers)}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                        <div className="product-deatil">
                            <h5 className="name">
                                {GenericForm.renderInputInline(prodCat, this)}
                                {GenericForm.renderInputInline(prodName, this)}
                                {GenericForm.renderInputInline(prodPrice, this)}
                                {GenericForm.renderInputInline(priceNotice, this)}
                            </h5>
                            <span className="tag1"></span>
                        </div>
                        <div className="description">
                            {GenericForm.renderInputInline(prodDesc, this)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {GenericForm.renderInputInline(prodDescDetail, this)}
                        {GenericForm.renderInputInline(prodSpec, this)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._saveBtnId} className="btn btn-success" onClick={this._onSaveProduct}/>
                            <StateButton btnId={this._publishBtnId} className="btn btn-success" onClick={this._onSaveProduct}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="estore-post" color="purple">
                        <header>
                            <span className="widget-icon"> <i className="fa fa-pencil"/></span>
                            <h2>EStore Item</h2>
                        </header>
                        <div className="widget-body">
                            {this._editProduct()}
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        )
    }
}

export default EStorePost;
