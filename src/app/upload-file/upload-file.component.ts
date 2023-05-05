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


  file!:File;
  myFile: IFile = {} as IFile;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    console.log('Upload initialised');
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    this.myFile.file = this.file;
    this.myFile.name = this.file.name;
    this.myFile.type = this.file.type;
    this.myFile.date = new Date();
    this.myFile.modified = this.myFile.date;
    this.myFile.size = this.file.size / (1024 * 1024);
  

    // Do something with the selected file, such as upload it to your server
  }

  uploadFile() {
    this.fileService.uploadFile(this.myFile);
    console.log('Successfully uploaded')
  }
  
}
