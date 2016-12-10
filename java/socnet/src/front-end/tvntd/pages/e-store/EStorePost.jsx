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
import NestableStore    from 'vntd-shared/stores/NestableStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import {EProductStore}  from 'vntd-root/stores/ArticleStore.jsx';

class EStorePost extends React.Component
{
    constructor(props) {
        super(props);

        this.dropzone = null;
        this._onSend  = this._onSend.bind(this);
        this._dzError = this._dzError.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._updateState = this._updateState.bind(this);
        this._editProduct = this._editProduct.bind(this);
        this._getPostData = this._getPostData.bind(this);
        this._onSaveProduct = this._onSaveProduct.bind(this);
        this._onPostProduct = this._onPostProduct.bind(this);

        this._myUuid = UserStore.getSelfUuid();
        this._prodDescId   = "prod-desc";
        this._prodSpecId   = "prod-spec";
        this._prodDetailId = "detail-desc";
        this._saveBtnId    = "save-product-btn";
        this._publishBtnId = "publish-product-btn";

        this._saveBtn = StateButtonStore.createButton(this._saveBtnId, function() {
            return StateButton.saveButtonFsm("Save", "Save Editing", "Saved Product");
        }); 
        this._publishBtn = StateButtonStore.createButton(this._publishBtnId, function() {
            return StateButton.saveButtonFsm("Create", "Create Product", "Published Product");
        });
    }

    componentDidMount() {
        this.unsub = EProductStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
        console.log(this.unsub);
    }

    _dzError() {
    }

    _onSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', this._myUuid);
    }

    _onBlurInput(e) {
        StateButtonStore.setButtonStateObj(this._publishBtn, "needSave");
    }

    _onSaveProduct() {
        console.log("Save product...");
        console.log(this._getPostData());
    }

    _onPostProduct() {
        StateButtonStore.setButtonStateObj(this._publishBtn, "saving");

        let product = this._getPostData();
        product.estore = true;
        product.articleUuid = _.uniqueId("uuid-");
        product.authorUuid  = this._myUuid;
        Actions.publishProduct(product);
    }

    _getPostData() {
        return {
            prodCat   : this.refs.prodCat.value,
            prodName  : this.refs.prodName.value,
            prodPrice : this.refs.prodPrice.value,
            prodNotice: this.refs.prodNotice.value,
            prodDesc  : NestableStore.getIndexString(this._prodDescId),
            prodDetail: NestableStore.getIndexString(this._prodDetailId),
            prodSpec  : NestableStore.getIndexString(this._prodSpecId),
            createDate: 0
        };
    }

    _clearPostData() {
        let refs = this.refs;
        refs.prodCat.value    = '';
        refs.prodName.value   = '';
        refs.prodPrice.value  = '';
        refs.prodNotice.value = '';
        NestableStore.clearItemIndex(this._prodDescId);
        NestableStore.clearItemIndex(this._prodDetailId);
        NestableStore.clearItemIndex(this._prodSpecId);
    }

    _updateState(store, data, status) {
        if (data.estore !== true || data.authorUuid !== this._myUuid) {
            return;
        }
        if (status === "ok") {
            StateButtonStore.setButtonStateObj(this._publishBtn, "saved");
        }
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
            inpName  : "prodSpec",
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
            url: "/user/upload-product-img"
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
                                {GenericForm.renderInputInline(prodCat, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(prodName, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(prodPrice, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(priceNotice, this, this._onBlurInput)}
                            </h5>
                            <span className="tag1"></span>
                        </div>
                        <div className="description">
                            {GenericForm.renderInputInline(prodDesc, this, this._onBlurInput)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {GenericForm.renderInputInline(prodDescDetail, this, this._onBlurInput)}
                        {GenericForm.renderInputInline(prodSpec, this, this._onBlurInput)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._saveBtnId} className="btn btn-success" onClick={this._onSaveProduct}/>
                            <StateButton btnId={this._publishBtnId} className="btn btn-success" onClick={this._onPostProduct}/>
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
