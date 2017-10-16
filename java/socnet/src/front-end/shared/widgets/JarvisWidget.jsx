/**
 * Created by griga on 12/1/15.
 */
import _          from 'lodash';
import $          from 'jquery';
import React      from 'react-mod';
import classnames from 'classnames';

class JarvisWidget extends React.Component
{
    constructor(props) {
        super(props);
        this.defaultProps = {
            colorbutton : true,
            editbutton  : true,
            togglebutton: true,
            deletebutton: true,
            custombutton: false,
            fullscreenbutton: true,

            collapsed: false,
            sortable : true,
            hidden   : false,
            color    : false,
            load     : false,
            refresh  : false
        };
    }

    render() {
        let colorClass = this.props.color ? 'jarviswidget-color-' + this.props.color : ''
        let classes = classnames('jarviswidget', colorClass, {
            'jarviswidget-sortable': this.props.sortable == true
        });
        let widgetProps = {};

        this.widgetId = _.uniqueId('jarviswidget-');
        [
            'colorbutton', 'editbutton', 'togglebutton',
            'deletebutton', 'fullscreenbutton', 'custombutton', 'sortable'
        ].forEach(function(option) {
            if (!this.props[option]) {
                widgetProps['data-widget-'+option] = false
            }
        }.bind(this));

        [
            'hidden', 'collapsed'
        ].forEach(function(option) {
            if (this.props[option]) {
                widgetProps['data-widget-'+option] = true
            }
        }.bind(this)); 

        [
            'refresh', 'load'
        ].forEach(function(option) {
            if (this.props[option]) {
                widgetProps['data-widget-'+option] = this.props[option]
            }
        }.bind(this));

        return (
            <div className={classes}
                id={this.widgetId} ref={this.widgetId} {...widgetProps} >
                {this.props.children}
            </div>
        )
    }

    componentDidMount() {
        $(this.refs[this.widgetId])
            .find('.widget-body')
            .prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>');
    }
}

class JarvisWidget.Body extends React.Component
{
    render() {
        let {children, props} = {...this.props};
        return (
            <div {...props}>
                <div className="widget-body">
                    {children}
                </div>
            </div>
        )
    }
}

export default JarvisWidget;
