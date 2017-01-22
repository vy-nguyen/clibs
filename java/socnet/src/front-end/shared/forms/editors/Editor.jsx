/**
 * https://github.com/sonyan/react-wysiwyg-editor.git
 */
'use strict';

import React          from 'react';
import TinyMCE        from 'react-tinymce';
import NestableStore  from 'vntd-shared/stores/NestableStore.jsx';

class Editor extends React.Component
{
    static propTypes() {
        return {
            content : React.PropTypes.string.isRequired,
            onChange: React.PropTypes.func.isRequired
        }
    }

    constructor(props) {
        super(props);
        this._emitChange = this._emitChange.bind(this);
        this.execCommand = this.execCommand.bind(this);

        this.state = {
            // this is anti-pattern but we treat this.props.content as initial content
            html: this.props.content
        };
    }

    _emitChange(e) {
        let editor  = this.refs.editor;
        let newHtml = editor.innerHTML;

        this.setState({
            html: newHtml
        }, function() {
            this.props.onChange({
                value: newHtml
            });
        }.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            html: nextProps.content
        });
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.content !== this.state.html || this.state.html === '';
    }

    execCommand(command, arg) {
        document.execCommand(command, false, arg);
    }

    render() {
        // customize css rules here
        var buttonSpacing = {marginRight: 2},
            toolbarStyle = {marginBottom: 3};

        /**
          * For list of supported commands
          * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
          */
        return (
            <div>
                <div style={toolbarStyle}>
                    <div className="btn-group" style={buttonSpacing}>
                        <button 
                            className="btn btn-default btn-xs dropdown-toggle" 
                            type="button" data-toggle="dropdown" 
                            aria-expanded="true">
                            <i className="fa fa-paragraph"></i> <i className="fa fa-caret-down"></i>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'P')}>
                                    Paragraph
                                </a>
                                <a href="javascript:;"
                                    onClick={this.execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE')}>
                                    Block Quote
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H1')}>
                                    Header 1
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H2')}>
                                    Header 2
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H3')}>
                                    Header 3
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H4')}>
                                    Header 4
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H5')}>
                                    Header 5
                                </a>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'formatBlock', 'H6')}>
                                    Header 6
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="btn-group btn-group-xs" role="group" style={buttonSpacing}>
                        <button type="button" className="btn btn-default" onClick={this.execCommand.bind(this, 'bold')}>
                            <i className="fa fa-bold"></i>
                        </button>
                        <button type="button" className="btn btn-default"
                            onClick={this.execCommand.bind(this, 'italic')}>
                            <i className="fa fa-italic"></i>
                        </button>
                        <button type="button" className="btn btn-default"
                            onClick={this.execCommand.bind(this, 'underline')}>
                            <i className="fa fa-underline"></i>
                        </button>
                        <button type="button" className="btn btn-default"
                            onClick={this.execCommand.bind(this, 'strikeThrough')}>
                            <i className="fa fa-strikethrough"></i>
                        </button>

                        <div className="btn-group" role="group">
                            <button 
                                className="btn btn-default btn-xs dropdown-toggle" 
                                type="button" data-toggle="dropdown" 
                                aria-expanded="true">
                                <i className="fa fa-text-height"></i> <i className="fa fa-caret-down"></i>
                            </button>
                            <ul className="dropdown-menu" role="menu">
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 1)}>1</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 2)}>2</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 3)}>3</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 4)}>4</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 5)}>5</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 6)}>6</a>
                                </li>
                                <li>
                                    <a href="javascript:;" onClick={this.execCommand.bind(this, 'fontSize', 7)}>7</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="btn-group btn-group-xs" role="group" style={buttonSpacing}>
                        <button type="button"
                            className="btn btn-default" onClick={this.execCommand.bind(this, 'insertOrderedList')}>
                            <i className="fa fa-list-ol"></i>
                        </button>
                        <button type="button"
                            className="btn btn-default" onClick={this.execCommand.bind(this, 'insertUnorderedList')}>
                            <i className="fa fa-list-ul"></i>
                        </button>
                    </div>

                    <div className="btn-group" style={buttonSpacing}>
                        <button className="btn btn-default btn-xs dropdown-toggle"
                            type="button" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-align-left"></i> <i className="fa fa-caret-down"></i>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'justifyLeft')}>
                                    Align Left
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'justifyRight')}>
                                    Align Right
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'justifyCenter')}>
                                    Align Center
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" onClick={this.execCommand.bind(this, 'justifyFull')}>
                                    Align Justify
                                </a>
                            </li>
                        </ul>
                    </div>

                    <button type="button"
                        className="btn btn-default btn-xs" onClick={this.execCommand.bind(this, 'removeFormat')}>
                        <i className="fa fa-eraser"></i>
                    </button>
                </div>

                <div ref="editor" {...this.props} contentEditable="true"
                    style={{
                        'border'   : '1px solid blue',
                        'minHeight': 200,
                        'height'   : 'auto',
                        'overflowY': 'hidden'
                    }}
                    dangerouslySetInnerHTML={{__html: this.state.html}}
                    onInput={this._emitChange}>
                </div>
            </div>
        );
    }
}

class EditorEntry extends React.Component
{
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._uploadCall = this._uploadCall.bind(this);
        this._filePicker = this._filePicker.bind(this);

        this._csrfToken  = $("meta[name='_csrf']").attr("content");
        this._csrfHeader = $("meta[name='_csrf_header']").attr("content");

        NestableStore.allocIndexString(props.id, props.entry.inpHolder)
    }

    _onChange(e) {
        let content = NestableStore.storeItemIndex(this.props.id, e.target.getContent(), true);
        if (this.props.onChange != null) {
            this.props.onChange(content);
        }
    }

    _uploadCall(blobInfo, success, failure) {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', '/user/upload/product-detail', true);
        xhr.onload = function() {
            console.log("result");
            console.log(xhr);
            if (xhr.status != 200) {
                failure('Server Error: ' + xhr.status);
                return;
            }
            let json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location != 'string') {
                failure('Invalid Response: ' + xhr.responseText);
                return;
            }
            success(json.location);
        };
        let formData = new FormData();

        formData.append('file', blobInfo.filename());
        formData.append(this._csrfHeader, this._csrfToken);
        xhr.setRequestHeader(this._csrfHeader, this._csrfToken);
        console.log("do upload......");
        console.log(xhr);
        console.log(formData);
        xhr.send(formData);
    }

    _filePicker(cb, value, meta) {
        let input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function() {
            let file = this.files[0];
            let id = 'img-' + (new Date()).getTime();
            let blobCache = tinymce.activeEditor.editorUpload.blobCache;
            let blobInfo = blobCache.create(id, file);
            blobCache.add(blobInfo);

            // call the callback and populate the Title field with the file name
            cb(blobInfo.blobUri(), { title: file.name });
        }
        input.click();
    }

    render() {
        const { entry, menu } = this.props;
        let menubar = false;

        if (menu === "short") {
            menubar = "file edit insert format";
        } else if (menu == "full") {
            menubar = "file edit insert view format table tools";
        }
        return (
            <TinyMCE content={entry.inpHolder}
                config={{
                    plugins: 'autoresize autolink link image lists print preview',
                    menubar: menubar,
                    toolbar: 'undo | bold italic | styleselect | image | alignleft aligncenter alignright',
                    file_picker_callback: this._filePicker,

                    automatic_uploads: true,
                    images_upload_url: '/user/upload/product-detail',
                    images_upload_handler: this._uploadCall
                }}
                onChange={this._onChange}
            />
        );
    }
}

export { EditorEntry, Editor };
export default Editor;
