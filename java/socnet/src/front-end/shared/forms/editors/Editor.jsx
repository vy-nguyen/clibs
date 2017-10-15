/**
 * https://github.com/sonyan/react-wysiwyg-editor.git
 */
'use strict';

import React          from 'react';
import $              from 'jquery';
import TinyMCE        from 'react-tinymce';
import NestableStore  from 'vntd-shared/stores/NestableStore.jsx';
import {Util}         from 'vntd-shared/utils/Enum.jsx';

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
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            html: nextProps.content
        });
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.content !== this.state.html || this.state.html === '';
    }

    render() {
        return null;
    }
}

class EditorEntry extends React.Component
{
    constructor(props) {
        let entry = props.entry;

        super(props);
        this._onChange   = this._onChange.bind(this);
        this._uploadCall = this._uploadCall.bind(this);
        this._filePicker = this._filePicker.bind(this);
        NestableStore.allocIndexString(entry.inpName, entry.inpHolder)

        this.tshrt = 'undo | bold italic | styleselect';
        this.tfull = this.tshrt + ' | image | alignleft aligncenter alignright';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    _onChange(e) {
        let content = e.target.getContent();

        if (content == null) {
            return;
        }
        NestableStore.storeItemIndex(this.props.entry.inpName, content, true);
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
        url = Util.choose(this.props.entry.uploadUrl, '/user/upload-img');
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

        if (entry.uploadUrl != null) {
            config = {
                automatic_uploads    : true,
                images_upload_handler: this._uploadCall,
                file_picker_callback : this._filePicker,
            };
        } else {
            config = {};
        }
        if (entry.menu === "short") {
            menubar = "file edit insert format";
            config.toolbar = this.tshrt;

        } else if (entry.menu == "full") {
            menubar = "file edit insert view format table tools";
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
            <TinyMCE id={entry.inpName} content={entry.inpDefVal}
                config={config} onChange={this._onChange}/>
        );
    }
}

export { EditorEntry, Editor };
export default Editor;
