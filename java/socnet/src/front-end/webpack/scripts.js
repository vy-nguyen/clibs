var scripts = {
    "aliases" : {
        "vntd-shared": "/src/front-end/shared",
        "vntd-root"  : "/src/front-end/tvntd",
        "node-module": "/node_modules",

        "react-mod": "/node_modules/react/react.js",
        "react-lib": "/node_modules/react/lib",
        "react-dom": "/node_modules/react-dom/dist/react-dom.min.js",
        "react-dom-server": "/node_modules/react-dom/server.js",
        "react-bootstrap" : "/node_modules/react-bootstrap/dist/react-bootstrap.min.js",
        "react-router"    : "/node_modules/react-router/umd/ReactRouter.min.js",
        "react-dropzone-component": "/node_modules/react-dropzone-component/dist/react-dropzone.js",

        "history/lib": "/node_modules/history/umd/History.min.js",
        "jquery": "/node_modules/jquery/dist/jquery.min.js",

        "moment"   : "/node_modules/moment/min/moment-with-locales.min.js",
        "moment-timezone": "/node_modules/moment-timezone/builds/moment-timezone.min.js",

        "morris": "/node_modules/morris.js/morris.min.js",
        "datatables.net": "/node_modules/datatables/media/js/jquery.dataTables.min.js",
        "datatables.net-buttons": "/node_modules/datatables-buttons/js/dataTables.buttons.js",
        "datatables.net-buttons.bootstrap": "/node_modules/datatables-buttons/js/buttons.bootstrap.js",
        "datatables.net-buttons.print": "/node_modules/datatables-buttons/js/buttons.print.js",
        "datatables.net-buttons.flash": "/node_modules/datatables-buttons/js/buttons.flash.js",
        "datatables.net-buttons.colVis": "/node_modules/datatables-buttons/js/buttons.colVis.js",

        "he"          : "/node_modules/he/he.js",
        "clockpicker" : "/node_modules/clockpicker/dist/bootstrap-clockpicker.min.js",
        "smartwidgets": "/src/front-end/smartadmin-plugin/smartwidgets/jarvis.widget.js",
    },
    "chunks": {
        "vendor": [
            "react-mod",
            "react-dom",
            "react-bootstrap",
            "react-router",
            "react-dropzone-component",
            "history/lib",
            "jquery",
            "moment",
            "he"
        ],
        "vendor.ui": [
            "clockpicker",
            "jquery-nestable",
        ],
        "vendor.datatables": [
            "datatables.net",
            "datatables-responsive",
            "datatables.net-responsive-bs"
        ],
        "vendor.graphs": [
            'script-loader!morris'
        ]
    },
    noParse: [
        "jquery",
        "moment"
    ]
};

module.exports = scripts;

/*
var scripts = {
    "aliases": {
        "redux": "/node_modules/redux/dist/redux.min.js",
        "marked": "/node_modules/marked/lib/marked.js",
        "lodash": "/node_modules/lodash/lodash.min.js",
        "jquery-ui": "/node_modules/jquery-ui/jquery-ui.js",
        "jquery-maskedinput": "/node_modules/jquery.maskedinput/src/jquery.maskedinput.js",
        "jquery-validate"   : "/node_modules/jquery-validation/dist/jquery.validate.js",
        "jquery-knob": "/node_modules/jquery-knob/dist/jquery.knob.min.js",
        "bootstrap-markdown": "/node_modules/bootstrap-markdown/js/bootstrap-markdown.js",
        "bootstrap-colorpicker": "/node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js",
        "fastclick": "/node_modules/fastclick/lib/fastclick.js",
        "ckeditor" : "/node_modules/ckeditor/ckeditor.js",
        "raphael" : "/node_modules/raphael/raphael-min.js",
        "dygraphs": "/node_modules/dygraphs/dygraph-combined.js",
        "chartjs" : "/node_modules/chart.js/Chart.min.js",
        "jquery-color"   : "/bower_components/jquery-color/jquery.color.js",
        "easy-pie" : "/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js",
        "bootstrap-validator": "/bower_components/bootstrapvalidator/dist/js/bootstrapValidator.min.js",
        bootstrap-duallistbox": "/bower_components/bootstrap-duallistbox/dist/jquery.bootstrap-duallistbox.min.js",
        bootstrap-timepicker": "/bower_components/bootstrap3-fontawesome-timepicker/js/bootstrap-timepicker.min.js",
        bootstrap-tagsinput": "/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js",
        "bootstrap": "/node_modules/bootstrap/dist/js/bootstrap.min.js",
        "bootstrap-slider": "/node_modules/bootstrap-slider/dist/bootstrap-slider.min.js",
        "bootstrap-progressbar": "/node_modules/bootstrap-progressbar/bootstrap-progressbar.min.js",

        jquery-nestable": "/bower_components/jquery-nestable/jquery.nestable.js",

        sparkline": "/bower_components/relayfoods-jquery.sparkline/dist/jquery.sparkline.min.js",

        datatables.net-bs": "/bower_components/datatables/media/js/dataTables.bootstrap.min.js",
        datatables.net-responsive": "/bower_components/datatables-responsive/js/dataTables.responsive.js",
        datatables.net-responsive.bootstrap": "/bower_components/datatables-responsive/js/responsive.bootstrap.js",

        pace" : "/bower_components/pace/pace.min.js",
        "flot": "/bower_components/Flot/jquery.flot.js",
        "flot-resize"  : "/bower_components/Flot/jquery.flot.resize.js",
        "flot-orderBar": "/bower_components/flot.orderbars/js/jquery.flot.orderBars.js",
        "flot-pie"     : "/bower_components/Flot/jquery.flot.pie.js",
        "flot-time"    : "/bower_components/Flot/jquery.flot.time.js",
        "flot-tooltip" : "/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js",
        "flot-fillbetween": "/bower_components/Flot/jquery.flot.fillbetween.js",

        "highcharts"    : "/bower_components/highcharts/highcharts.js",
        "highchartTable": "/bower_components/highchartTable/jquery.highchartTable.js",
        "jqgrid"          : "/bower_components/jqgrid/js/minified/jquery.jqGrid.min.js",
        "jqgrid-locale-en": "/bower_components/jqgrid/js/i18n/grid.locale-en.js",
        "ionslider"       : "/bower_components/ion.rangeSlider/js/ion.rangeSlider.min.js",
        "fuelux-wizard"   : "/bower_components/fuelux/js/wizard.js",
        "jcrop"           : "/bower_components/Jcrop/js/Jcrop.min.js",
        "jvectormap"      : "/bower_components/bower-jvectormap/jquery-jvectormap-1.2.2.min.js",
        "magnific-popup"  : "/bower_components/magnific-popup/dist/jquery.magnific-popup.js",
        "jvectormap-world-mill-en": "/bower_components/bower-jvectormap/jquery-jvectormap-world-mill-en.js",
        "select2"    : "/node_modules/select2/dist/js/select2.min.js",
        "summernote" : "/node_modules/summernote/dist/summernote.min.js",
        "markdown"   : "/node_modules/markdown/lib/markdown.js",
        "to-markdown": "/node_modules/to-markdown/dist/to-markdown.js",
        "nouislider" : "/node_modules/nouislider/distribute/nouislider.min.js",
        "x-editable" : "/node_modules/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js",
        "dropzone"   : "/node_modules/dropzone/dist/min/dropzone.min.js",
        "utf8"       : "/node_modules/utf8/utf8.js",
        "fullcalendar": "/src/front-end/smartadmin-plugin/fullcalendar/jquery.fullcalendar.min.js",
        "notification": "/src/front-end/smartadmin-plugin/notification/SmartNotification.min.js",
        "chatbox"     : "/src/front-end/smartadmin-plugin/chat/chat.box.js",
    },
    "chunks": {
        "vendor": [
            "jquery-ui",
            "moment-timezone",
            "easy-pie",
            "bootstrap",
            "fastclick",
            "fullcalendar",
            "notification",
            "smartwidgets",
            "jvectormap"
        ],
        "vendor.ui": [
            "select2",
            "script-loader!summernote",
            "script-loader!markdown",
            "script-loader!he",
            "script-loader!to-markdown",
            "script-loader!bootstrap-markdown",
            "bootstrap-slider",
            "jquery-validate",
            "jquery-maskedinput",
            "bootstrap-validator",
            "ionslider",
            "nouislider",
            "bootstrap-duallistbox",
            "bootstrap-timepicker",
            "bootstrap-colorpicker",
            "bootstrap-tagsinput",
            "jquery-knob",
            "x-editable",
            "fuelux-wizard",
            "dropzone"
        ],
        "vendor.graphs": [
            'script-loader!raphael',
            'script-loader!dygraphs',
            'script-loader!chartjs',
            'script-loader!highcharts',
            'script-loader!highchartTable'
        ]
    },
    noParse: [
        "jquery-ui",
        "to-markdown",
        "raphael",
        "morris",
        "dygraphs",
        "chartjs",
        "ckeditor"
        "react",
        "moment-timezone",
        "easy-pie",
        "sparkline",
        'react-dom',
        "select2",
        "summernote",
        "bootstrap-markdown",
        "bootstrap-slider",
        "bootstrap-progressbar",
        "jquery-validate",
        "jquery-maskedinput",
        "bootstrap-validator",
        "ionslider",
        "nouislider",
        "bootstrap-duallistbox",
        "bootstrap-timepicker",
        "clockpicker",
        "bootstrap-colorpicker",
        "bootstrap-tagsinput",
        "jquery-knob",
        "x-editable",
        "fuelux-wizard",
        "dropzone",
        "jquery-nestable",
        "superbox",
        "datatables.net",
        "datatables.net-bs",
        "datatables.net-buttons",
        "datatables.net-buttons.bootstrap",
        "datatables.net-buttons.print",
        "datatables.net-buttons.flash",
        "datatables.net-buttons.colVis",
        "datatables.net-responsive",
        "datatables.net-responsive.bootstrap",
    ]
};
*/
