/**
 * Copyright by Vy Ngyen (2016)
 * BSD License.
 */
'use strict';

import React               from 'react-mod';
import _                   from 'lodash';

import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import ErrorView           from 'vntd-shared/layout/ErrorView.jsx';
import { AdsStore }        from 'vntd-root/stores/ArticleStore.jsx';
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
            field    : 'ownerPhones',
            inpName  : this._getId('ownerPhones-'),
            inpHolder: 'Enter your phone',
            labelTxt : 'Contact Phones'
        }, {
            field    : 'ownerEmail',
            inpName  : this._getId('ownerEmail-'),
            inpHolder: 'Enter your email',
            labelTxt : 'Contact Email'
        } ],
        propertyInfo = [ {
            field    : 'image',
            url      : '/user/upload-img',
            inpName  : this._getId('room-img-'),
            dropzone : true,
            labelTxt : 'Drop Images'
        }, {
            field    : 'street',
            inpName  : this._getId('street-'),
            inpHolder: 'Property street address',
            labelTxt : 'Street Address'
        }, {
            field    : 'city',
            inpName  : this._getId('city-'),
            inpHolder: 'Property city',
            labelTxt : 'City'
        } ];
        this.forms = {
            formId     : 'room-ads',
            formFmt    : 'client-form',
            hiddenHead : null,
            hiddenTail : null,
            formEntries: [ {
                twoCols: true,
                legend : 'Owner Information',
                sectFmt: 'product-deatil',
                entries: owerInfo
            }, {
                legend : 'Property Info',
                sectFmt: 'product-deatil',
                entries: propertyInfo
            } ],
            buttons: [ {
                btnName  : 'room-ads-cancel',
                btnCreate: function() {
                    return {
                        success: {
                            text     : 'Cancel',
                            nextState: 'success',
                            className: 'btn btn-info'
                        },
                        failure: {
                            text     : 'Cancel Failed',
                            nextState: 'success',
                            className: 'btn btn-danger'
                        }
                    };
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

    submitAct(data) {
        super.submitAct();
    }
}

class AdsRoomRenting extends React.Component
{
    constructor(props) {
        super(props);
        this.data = new RoomRenting(props, "abc");
    }

    render() {
        let defValue = {
            ownerName  : "Vy Nguyen",
            ownerPhones: "123-123-1234",
            ownerEmail : "vnguyen@abc.com"
        };
        return (
            <ProcessForm form={this.data} defValue={defValue} store={AdsStore}/>
        );
    }
}

export default AdsRoomRenting;
