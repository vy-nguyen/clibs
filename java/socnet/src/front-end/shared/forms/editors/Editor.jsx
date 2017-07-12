/**
 * https://github.com/sonyan/react-wysiwyg-editor.git
 */
'use strict';

import React          from 'react';
import $              from 'jquery';
import TinyMCE        from 'react-tinymce';
import NestableStore  from 'vntd-shared/stores/NestableStore.jsx';
import ErrorView      from 'vntd-shared/layout/ErrorView.jsx';
import {choose}       from 'vntd-shared/utils/Enum.jsx';

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
        /* eslint-disable */
        const cmd = 'formatBlock', font = 'fontSize', jsref = "javascript:;";
        /* eslint-enable */

        let buttonSpacing = {marginRight: 2},
            toolbarStyle = {marginBottom: 3};

        /**
          * For list of supported commands
          * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
          */
        return (
            <div>
                <div style={toolbarStyle}>
                    <div className="btn-group" style={buttonSpacing}>
                        <button className="btn btn-default btn-xs dropdown-toggle" 
                            type="button" data-toggle="dropdown" 
                            aria-expanded="true">
                            <i className="fa fa-paragraph"></i>
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'P')}>
                                    Paragraph
                                </a>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'BLOCKQUOTE')}>
                                    Block Quote
                                </a>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'H1')}>
                                    Header 1
                                </a>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'H2')}>
                                    Header 2
                                </a>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'H3')}>
                                    Header 3
                                </a>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, cmd, 'H4')}>
                                    Header 4
                                </a>
                                <a href={jsref} 
                                    onClick={this.execCommand.bind(this, cmd, 'H5')}>
                                    Header 5
                                </a>
                                <a href={jsref} 
                                    onClick={this.execCommand.bind(this, cmd, 'H6')}>
                                    Header 6
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="btn-group btn-group-xs"
                        role="group" style={buttonSpacing}>
                        <button type="button" className="btn btn-default"
                            onClick={this.execCommand.bind(this, 'bold')}>
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
                                <i className="fa fa-text-height"></i>
                                <i className="fa fa-caret-down"></i>
                            </button>
                            <ul className="dropdown-menu" role="menu">
                                <li>
                                    <a href={jsref}
                                        onClick={this.execCommand.bind(this, font, 1)}>1</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 2)}>2</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 3)}>3</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 4)}>4</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 5)}>5</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 6)}>6</a>
                                </li>
                                <li>
                                    <a href={jsref} 
                                        onClick={this.execCommand.bind(this, font, 7)}>7</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="btn-group btn-group-xs"
                        role="group" style={buttonSpacing}>
                        <button type="button"
                            className="btn btn-default" 
                            onClick={this.execCommand.bind(this, 'insertOrderedList')}>
                            <i className="fa fa-list-ol"></i>
                        </button>
                        <button type="button"
                            className="btn btn-default" 
                            onClick={this.execCommand.bind(this, 'insertUnorderedList')}>
                            <i className="fa fa-list-ul"></i>
                        </button>
                    </div>

                    <div className="btn-group" style={buttonSpacing}>
                        <button className="btn btn-default btn-xs dropdown-toggle"
                            type="button" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-align-left"></i>
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, 'justifyLeft')}>
                                    Align Left
                                </a>
                            </li>
                            <li>
                                <a href={jsref} 
                                    onClick={this.execCommand.bind(this, 'justifyRight')}>
                                    Align Right
                                </a>
                            </li>
                            <li>
                                <a href={jsref} 
                                    onClick={this.execCommand.bind(this, 'justifyCenter')}>
                                    Align Center
                                </a>
                            </li>
                            <li>
                                <a href={jsref}
                                    onClick={this.execCommand.bind(this, 'justifyFull')}>
                                    Align Justify
                                </a>
                            </li>
                        </ul>
                    </div>

                    <button type="button"
                        className="btn btn-default btn-xs" 
                        onClick={this.execCommand.bind(this, 'removeFormat')}>
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
        NestableStore.allocIndexString(props.id, props.entry.inpHolder)

        this.tshrt = 'undo|bold italic|styleselect|alignleft aligncenter alignright';
        this.tfull =
            'undo|bold italic|styleselect|image|alignleft aligncenter alignright';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    _onChange(e) {
        let content = NestableStore
            .storeItemIndex(this.props.entry.id, e.target.getContent(), true);
        if (this.props.onChange != null) {
            this.props.onChange(content);
        }
    }

    _uploadCall(blobInfo, success, failure) {
        let xhr, url, header, token, form = new FormData(), entry = this.props.entry;
        form.append('file', blobInfo.blob());
        form.append('name', blobInfo.filename());
        form.append('authorUuid', 0);
        form.append('articleUuid', 0);

        xhr = new XMLHttpRequest();
        url = choose(this.props.entry.uploadUrl, '/user/upload-img');
        xhr.withCredentials = false;
        xhr.open('POST', url, true);

        header = $("meta[name='_csrf_header']").attr("content");
        token  = $("meta[name='_csrf']").attr("content");
        xhr.setRequestHeader(header, token);

        xhr.onload = function() {
            let json;
            if (xhr.status != 200) {
                failure('Http error: ' + xhr.status);
                return;
            }
            json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location != 'string') {
                failure('Invalid JSON ' + xhr.responseText);
                return;
            }
            if (entry.uploadOk != null) {
                entry.uploadOk(entry, json);
            }
            success(json.location);
        };
        xhr.send(form);
    }

    _filePicker(cb, value, meta) {
        let input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function() {
            /* eslint-disable */
            let file = this.files[0];
            let id = 'img-' + (new Date()).getTime();
            let blobCache = tinymce.activeEditor.editorUpload.blobCache;
            let blobInfo = blobCache.create(id, file);
            /* eslint-enable */

            // call the callback and populate the Title field with the file name
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
        }
        input.click();
    }

    render() {
        const entry = this.props.entry;
        let onBlur, toolbar, config, menubar = '';

        if (entry.menu === "short") {
            menubar = "file edit insert format";
        } else if (entry.menu == "full") {
            menubar = "file edit insert view format table tools";
        }
        if (entry.uploadUrl != null) {
            config = {
                automatic_uploads    : true,
                images_upload_handler: this._uploadCall,
                file_picker_callback : this._filePicker,
            };
        } else {
            config = {
                // toolbar: tshrt
            };
        }
        onBlur = this.props.onBlur;
        config.plugins = 'autoresize autolink link image lists print preview';
        config.menubar = '';

        if (this.props.onBlur != null) {
            config.setup = function(ed) {
                ed.on('blur', function(e) {
                    onBlur();
                });
            };
        }
        return (
            <TinyMCE id={entry.id} content={entry.inpDefVal}
                config={config} onChange={this._onChange}/>
        );
    }
}

export { EditorEntry, Editor };
export default Editor;
