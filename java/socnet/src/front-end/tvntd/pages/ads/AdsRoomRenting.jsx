/**
 * Copyright by Vy Ngyen (2016)
 * BSD License.
 */
'use strict';

import React               from 'react-mod';
import _                   from 'lodash';

import History             from 'vntd-shared/utils/History.jsx';
import Lang                from 'vntd-root/stores/LanguageStore.jsx';
import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import ErrorView           from 'vntd-shared/layout/ErrorView.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import AdPropertyStore     from 'vntd-root/stores/AdPropertyStore.jsx';
import { GenericAds }      from './PostAds.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class RoomRenting extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        let owerInfo = [ {
            field    : 'ownerName',
            inpName  : this._getId('ownerName-'),
            inpHolder: 'Enter your name',
            labelTxt : "Owner Name"
        }, {
            field    : 'ownerPhone',
            inpName  : this._getId('ownerPhones-'),
            inpHolder: 'Enter your phone',
            labelTxt : 'Contact Phones'
        }, {
            field    : 'ownerEmail',
            inpName  : this._getId('ownerEmail-'),
            inpHolder: 'Enter your email',
            labelTxt : 'Contact Email'
        }, {
            field    : 'rentPrice',
            inpName  : this._getId('ads-rent-'),
            inpHolder: '$500',
            labelTxt : 'Rent Price'
        } ],
        propertyAddr = [ {
            field    : 'street',
            inpName  : this._getId('ads-street-'),
            inpHolder: 'Property street address',
            labelTxt : 'Street Address'
        }, {
            field    : 'city',
            inpName  : this._getId('ads-city-'),
            inpHolder: 'Property city',
            labelTxt : 'City'
        }, {
            field    : 'state',
            inpName  : this._getId('ads-state-'),
            inpHolder: 'CA',
            labelTxt : 'State'
        }, {
            field    : 'zip',
            inpName  : this._getId('ads-zip-'),
            labelTxt : 'Zip Code'
        } ],
        propertyInfo = [ {
            field    : 'image',
            url      : '/user/upload-img',
            inpName  : this._getId('room-img-'),
            dropzone : true,
            labelTxt : 'Drop Images'
        }, {
            field    : 'desc',
            editor   : true,
            inpName  : this._getId('desc-'),
            labelTxt : 'Property Description'
        } ];
        this.forms = {
            formId     : 'room-ads',
            formFmt    : 'client-form',
            submitFn   : Actions.postRealtorAds,
            hiddenHead : null,
            hiddenTail : null,
            formEntries: [ {
                twoCols: true,
                legend : 'Owner Information',
                sectFmt: 'product-deatil',
                entries: owerInfo
            }, {
                twoCols: true,
                legend : 'Property Address',
                sectFmt: 'product-deatil',
                entries: propertyAddr
            }, {
                legend : 'Property Info',
                sectFmt: 'product-deatil',
                entries: propertyInfo
            } ],
            buttons: [ {
                btnCancel: true,
                btnName  : 'room-ads-cancel',
                btnCreate: function() {
                    return StateButton.basicButton("Cancel");
                }
            }, {
                btnName  : 'room-ads-submit',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Create", "Submit", "Published");
                }
            } ]
        };
        return this;
    }

    submitError(store, result, status) {
        // Return field names to highlight the error.
        return {
            street: true,
            city  : true,
            state : true,
            zip   : true
        };
    }

    validateInput(data, errFlags) {
        let price, rawPrice = data.rentPrice;

        price = Number(rawPrice.replace(/[^0-9\.-]+/g, ""));
        if (price == 0) {
            errFlags['rentPrice'] = true;
            errFlags['errText'] = Lang.translate("You need to enter the valid price");
        }
        data.rentPrice = price;
        return data;
    }

    onClick(btn, btnState) {
        if (btn.btnCancel === true) {
            this.clearData();
            History.goBack();
        } else {
            super.onClick(btn, btnState);
        }
    }
}

class AdsRoomRenting extends GenericAds
{
    constructor(props) {
        super(props);
        this.data = new RoomRenting(props, "ads-");
    }

    // @Override
    //
    _renderForm() {
        return <ProcessForm form={this.data} store={AdPropertyStore}/>
    }
}

export default AdsRoomRenting;
