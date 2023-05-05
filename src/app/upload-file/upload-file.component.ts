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

  constructor(private fileService: FileService) { }

  ngOnInit() {
    console.log('Upload initialised');
  }
  onFileSelected(event: any) {
    console.log("aaaa")
    this.file = event.target.files[0];
    // Do something with the selected file, such as upload it to your server
  }

  uploadFile(file: File) {
    var myFile = {} as IFile;
    myFile.file = file;
    myFile.date = new Date();
    myFile.modified = myFile.date;
    myFile.name = file.name;

    this.fileService.uploadFile(myFile);
    console.log(myFile);
  }
  
}
