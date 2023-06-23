import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as events from "events";
import { FileService } from '../services/file.service';
import { IFile } from '../model/File';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit{


  file:File| null = null;
  fileForm!: FormGroup;

  myFile: IFile = {} as IFile;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    console.log('Upload initialised');
    this.fileForm = new FormGroup({
      description: new FormControl(''),
      tags: new FormControl(''),
      favourite: new FormControl(''),
    });
  }

  handleDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    document.getElementById('file-drag')!.classList.add('hover');
  }
  
  handleDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('file-drag')!.classList.remove('hover');


  }
  
  handleFileSelect(event: any) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('file-drag')!.classList.remove('hover');
  
    this.file = event.dataTransfer.files[0];
    this.createMyFile();
  }


  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.createMyFile();
  }

  createMyFile(){
    if (this.file != null) {
      this.myFile.file = this.file;
      this.myFile.name = this.file.name;
      this.myFile.type = this.file.type;
      this.myFile.date_uploaded = new Date();
      this.myFile.date_modified = this.myFile.date_uploaded;
      this.myFile.size = this.file.size / (1024 * 1024);

    }
  }

  uploadFile() {
    this.myFile.description = this.fileForm.value.description
    this.myFile.favourite = this.fileForm.value.favourite;
    this.myFile.tags = this.fileForm.value.tags.split(" ")
    console.log(this.myFile)
    this.fileService.uploadFile(this.myFile);
    this.file = null;
    this.myFile = {} as IFile;
  }
  
}
