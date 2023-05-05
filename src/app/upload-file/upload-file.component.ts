import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as events from "events";
import { FileService } from '../services/file.service';
import { IFile } from '../model/File';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit{


  file:File| null = null;
  myFile: IFile = {} as IFile;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    console.log('Upload initialised');
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
      this.myFile.date = new Date();
      this.myFile.modified = this.myFile.date;
      this.myFile.size = this.file.size / (1024 * 1024);
    }
  }

  uploadFile() {
    this.fileService.uploadFile(this.myFile);
    console.log('Successfully uploaded');
    this.file = null;
    this.myFile = {} as IFile;
  }
  
}
