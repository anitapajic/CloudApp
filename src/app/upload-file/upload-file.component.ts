import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as events from "events";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, AfterViewInit{

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileSelect') fileSelect!: ElementRef<HTMLElement>;
  @ViewChild('fileDrag') fileDrag!: ElementRef<HTMLElement>;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLElement>;
  @ViewChild('m') m!: ElementRef<HTMLElement>;
  @ViewChild('start') start!: ElementRef<HTMLElement>;
  @ViewChild('response') response!: ElementRef<HTMLElement>;
  @ViewChild('notImage') notImage!: ElementRef<HTMLElement>;
  @ViewChild('file_image') file_image!: ElementRef<HTMLElement>;
  @ViewChild('file_upload_form') file_upload_form!: ElementRef<HTMLFormElement>;
  @ViewChild('pBar') pBar!: ElementRef<HTMLElement>;
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
    // Initialize variables
  }

  ngAfterViewInit() {
    this.Init();
    this.onFileSelected();
  }
  Init() {
    console.log('Upload initialised');

    if (this.fileSelect?.nativeElement) {
      this.fileSelect.nativeElement.addEventListener(
        'change',
        this.fileSelectHandler,
        false
      );
    }

    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      if (this.fileDrag?.nativeElement) {
        this.fileDrag.nativeElement.addEventListener(
          'dragover',
          this.fileDragHover,
          false
        );
        this.fileDrag.nativeElement.addEventListener(
          'dragleave',
          this.fileDragHover,
          false
        );
        this.fileDrag.nativeElement.addEventListener(
          'drop',
          this.fileSelectHandler,
          false
        );
      }
    }
  }
  onFileSelected() {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.addEventListener(
        'change',
        this.fileInputChangeHandler,
        false
      );
    }

    if (this.submitButton?.nativeElement) {
      this.submitButton.nativeElement.addEventListener(
        'click',
        this.submitButtonClickHandler,
        false
      );
    }
  }

  fileInputChangeHandler(e: Event) {
    var inputElement = e.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      var files = inputElement.files;
      this.fileDragHover(e);
      for (var i = 0, f; (f = files[i]); i++) {
        this.parseFile(f);
        this.uploadFile(f);
      }
    }
  }

  submitButtonClickHandler(e: Event) {
    e.preventDefault();
    if (this.file_upload_form?.nativeElement) {
      this.file_upload_form.nativeElement.submit();
    }
  }

  attachEvents() {
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      if (this.fileSelect?.nativeElement) {
        this.fileSelect.nativeElement.addEventListener("change", this.fileSelectHandler, false);
      }

      if (this.fileDrag?.nativeElement) {
        this.fileDrag.nativeElement.addEventListener("dragover", this.fileDragHover, false);
        this.fileDrag.nativeElement.addEventListener("dragleave", this.fileDragHover, false);
        this.fileDrag.nativeElement.addEventListener("drop", this.fileSelectHandler, false);
      }
    }
  }

  fileDragHover(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.fileDrag) {
      this.fileDrag.nativeElement.className = e.type === "dragover" ? "hover" : "modal-body-upload";
    }
  }
  onSelectFile() {
    this.Init(); // Call Init inside onSelectFile
    this.onFileSelected(); // Call onFileSelected inside onSelectFile
  }

  fileSelectHandler(e: Event) {
    var inputElement = e.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      var files = inputElement.files;
      this.fileDragHover(e);
      for (var i = 0, f; (f = files[i]); i++) {
        this.parseFile(f);
        this.uploadFile(f);
      }
      this.onSelectFile();
    }
  }

  parseFile(file: File) {
    console.log(file.name);
    //this.output("<strong>" + encodeURI(file.name) + "</strong>")

    var imageName = file.name;
    var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
    if (isGood) {
      this.start.nativeElement.classList.add("hidden");
      this.response.nativeElement.classList.remove("hidden");
      this.notImage.nativeElement.classList.add("hidden");

      this.file_image.nativeElement.classList.remove("hidden");

    }
    else {
      this.file_image.nativeElement.classList.add("hidden");
      this.notImage.nativeElement.classList.remove("hidden");
      this.start.nativeElement.classList.remove("hidden");
      this.response.nativeElement.classList.add("hidden");

    }

  }

  uploadFile(file: File): void {
    const xhr = new XMLHttpRequest();
    const fileSizeLimit = 1024;
    const pBar = document.getElementById("file-progress") as HTMLProgressElement;

    if (xhr.upload) {
      if (file.size <= fileSizeLimit * 1024 * 1024) {
        xhr.onreadystatechange = (ev) => {
          if (xhr.readyState === 4) {
            console.log('good');
          }
        };

        // Set progress bar max value
        if (pBar) {
          pBar.max = file.size;
        }

        // Send file to server
        xhr.open('POST', 'upload.php', true);
        xhr.setRequestHeader('X-File-Name', file.name);
        xhr.setRequestHeader('X-File-Size', file.size.toString());
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(file);

        // Update progress bar
        xhr.upload.addEventListener('progress', (ev) => {
          if (pBar) {
            pBar.value = ev.loaded;
          }
        });
      } else {
        alert('File size exceeds limit!');
      }
    } else {
      alert('Your browser does not support file upload!');
    }
  }





}
