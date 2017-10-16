/**
 *
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import ReactDOM     from 'react-dom';

import syncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';

const validateCommonOptions = {
    rules       : {},
    messages    : {},
    errorElement: 'em',
    errorClass  : 'invalid',
    highlight: function(element, errorClass, validClass) {
        $(element).addClass(errorClass).removeClass(validClass);
        $(element).parent().addClass('state-error').removeClass('state-success');
    },
    unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass(errorClass).addClass(validClass);
        $(element).parent().removeClass('state-error').addClass('state-success');
    },
    errorPlacement: function(error, element) {
        if (element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
};

class UiValidate extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let form = $(findDOMNode(this)),
        validate = {
            rules       : {},
            messages    : {},
            errorElement: validateCommonOptions.errorElement,
            errorClass  : validateCommonOptions.errorClass,
            highlight   : validateCommonOptions.highlight,
            unhighlight : validateCommonOptions.unhighlight,
            errorPlacement: validateCommonOptions.errorPlacement
        };
        form.find('[data-smart-validate-input], [smart-validate-input]')
            .each(function () {
            let $input = $(this), fieldName = $input.attr('name');

            validate.rules[fieldName] = {};
            if ($input.data('required') != undefined) {
                validate.rules[fieldName].required = true;
            }
            if ($input.data('email') != undefined) {
                validate.rules[fieldName].email = true;
            }

            if ($input.data('maxlength') != undefined) {
                validate.rules[fieldName].maxlength = $input.data('maxlength');
            }

            if ($input.data('minlength') != undefined) {
                validate.rules[fieldName].minlength = $input.data('minlength');
            }

            if ($input.data('message')) {
                validate.messages[fieldName] = $input.data('message');
            } else {
                _.forEach($input.data(), function(value, key) {
                    if (key.search(/message/)== 0){
                        if (!validate.messages[fieldName]) {
                            validate.messages[fieldName] = {};
                        }
                        var messageKey = key.toLowerCase().replace(/^message/,'')
                        validate.messages[fieldName][messageKey] = value;
                    }
                });
            }
        }.bind(this));
        form.validate(_.extend(validate, this.props.options))
    }

    render() {
        return (
            this.props.children
        )
    }
}

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(UiValidate);
