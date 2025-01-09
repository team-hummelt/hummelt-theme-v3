import * as React from 'react';
import {Dropzone} from "dropzone";
import Form from "react-bootstrap/Form";

let uploadDropzone;
let dropzoneContainer;
import * as appTools from "./AppTools";

let addIdUpload = [];
export const dropzoneUpload = (callback, formValue, container, template, builder_id) => {

    let resetBtn = jQuery('.clear-dropzone');
    let previewNode = document.getElementById(template);
    let previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    dropzoneContainer = document.getElementById(container);
    //uploadDropzone.destroy()
    uploadDropzone = new Dropzone(dropzoneContainer, {
        url: publicSettings.ajax_form_url,
        acceptedFiles: formValue.config.accept,
        paramName: "file",
        method: "post",
        // timeout: 180000,
        maxFilesize: formValue.config.maxFileSize,
        previewTemplate: previewTemplate,
        /// previewsContainer: container,
        parallelUploads: 1,
        maxFiles: formValue.config.maxFiles,  //dz-max-files-reached
        chunking: true,
        forceChunking: true,
        chunkSize: 256000,
        parallelChunkUploads: false,
        retryChunks: false,
        retryChunksLimit: 3,
        dictDefaultMessage: formValue.message.drag_file_txt, //'Dateien hier per Drag & Drop ablegen oder klicken.',
        dictInvalidFileType: formValue.message.invalid_type_txt, //'Sie können keine Dateien dieses Typs hochladen.',
        dictFallbackMessage: 'Ihr Browser unterstützt keine Drag\'n\'Drop-Datei-Uploads.',
        dictFileTooBig: formValue.message.file_large_txt,//'Datei ist zu groß ({{filesize}} MB). Maximale Dateigröße: {{maxFilesize}} MB.',
        dictMaxFilesExceeded: formValue.message.max_total_file_txt,//'Maximale Dateigröße ist {{maxFiles}}',
        addRemoveLinks: false,
        autoProcessQueue: true,
        dictRemoveFile: 'Datei entfernen',
        clickable: ".btn-open-file",
        init: function () {
            let _this = this;
            this.on("addedfile", function (file) {

            });
            this.on("uploadprogress", function (file, progress, bytesSent) {

            });

            this.on("totaluploadprogress", function (totalBytes, progress, totalBytesSent) {

            });

            this.on("sending", function (file, xhr, formData) {
                file.previewElement.querySelector('.dz-progress').classList.add('active')
                formData.append("method", 'chunk_upload');
                formData.append("_handle", publicSettings.form_handle);
                formData.append("token", publicSettings.form_token);
                formData.append("filesize", file.size);
                formData.append("filename", file.name);
                let inputData = document.getElementById(builder_id);
                let input = new FormData(inputData);
                for (let [name, value] of input) {
                    formData.append(name, value);
                }
            })

            this.on("queuecompvare", function (progress) {

            });

            this.on("complete", function (file) {

            });

            this.on("success", function (file, response) {
                file.previewElement.classList.add('upload-success');
                let addObj;
                if (response.status) {
                     addObj = {
                        'id': response.id,
                        'file_name': response.file_name,
                        'file': response.file
                    }
                    addIdUpload.push(addObj)
                    file.previewElement.querySelector('.dz-progress').remove()
                }
                //JSON.stringify(
                let formData = {
                   // 'files': addObj,
                    addObj
                }
                callback(addObj, 'upload')
            })

            this.on("error", function (file, response) {
                file.previewElement.querySelector('.dz-progress').remove()
                file.previewElement.classList.add('upload-error')
                setTimeout(() => {
                      //this.removeFile(file);
                }, 5000);
            })

            this.on("removedfile", function (file) {
                let msg = `Datei erfolgreich gelöscht. (${file.name})`
                let formData = {
                    'id': file.upload.uuid,
                }
                callback(formData, 'delete')

            })

            this.on("queuecomplete", function (progress) {

            });
        }
    })
}