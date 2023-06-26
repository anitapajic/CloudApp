import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FileService } from '../services/file.service';
import { CognitoService } from '../services/cognito.service';
import { newIUser } from '../model/User';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';
import {metaIFile} from "../model/File";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  isActiveDash:boolean =true;
  isActiveFolder:boolean =false;
  isActiveFav:boolean =false;
  folders : string[] = [];
  previousFolder!: string;
  currentFolder! :string;
  rootFolder!: string;
  sharedFolders : string[] = [];
  myImage! : SafeResourceUrl ;
  myVideo! : SafeResourceUrl ;
  myPDF! : SafeResourceUrl ;
  data! : metaIFile;
  isEditMode = false;
  isImage = false;
  isVideo = false;
  isPDF = false;
  dataIsFull = false;
  tempData! : any;

  constructor(private fileService: FileService, private cognito: CognitoService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {

    this.isImage = false;
    this.isVideo = false;
    this.isPDF = false;
    this.dataIsFull = false;

    this.cognito.getUser().then((user)=>{
      this.currentFolder = user.attributes['email'];
      this.rootFolder = this.currentFolder;

      this.getFolders()
    }
    )



  }
  getFolders(){
    this.fileService.getFolders(this.currentFolder)
    .subscribe(
      (folders: any) => {
        this.folders = folders['files'];
        this.getShared()

        },
      (error: any) => {
        console.error(error);
        // Handle the error here
      }
    );
  }

  getShared(){
    // rootFolder je username
    this.cognito.getUserData(this.rootFolder).subscribe(
      (response : any) => {
        this.sharedFolders = response.data['folders']
        this.folders = [...this.folders, ...this.sharedFolders];


    }
    );


  }
  selectedButton: string = 'dashboard';

  selectButton(button: string): void {
    this.selectedButton = button;
  }
  activityStatus(){
    this.isActiveDash = false
    this.isActiveFolder = true
  }

  handleClick(item: any) {
    console.log("Clicked:", item);
    // Handle the click event for the clicked item here
  }

  isFile(obj: string): boolean {
    return obj.includes('.') && !obj.includes('/');
  }

  changeFolder(obj : string){
    this.folders = [];

    if(obj == '/'){
      this.currentFolder = this.previousFolder;
      this.previousFolder = this.rootFolder;
      this.isImage = false;
      this.isVideo = false;
      this.isPDF = false;
      this.dataIsFull = false;
    }
    else{
      this.previousFolder = this.currentFolder;
      this.currentFolder = this.currentFolder + "%2F" + obj;
      this.isImage = false;
      this.isVideo = false;
      this.isPDF = false;
      this.dataIsFull = false;
    }
    let test = this.currentFolder
    if(obj.includes('/') && obj.length > 1){
      test = obj.replaceAll('/', '%2F')
    }
    this.fileService.getFolders(test)
    .subscribe(
      (folders: any) => {
        this.folders = folders['files'];
        if (this.rootFolder == this.currentFolder){
          this.getShared()
        }

        console.log(this.folders);
        // Further actions with the folders
      },
      (error: any) => {
        console.error(error);
        // Handle the error here
      }
    );
  }

  openPicture(pictureName : string) {
    this.fileService.getPictureData(this.currentFolder + "%2F" + pictureName).subscribe(
      (response) => {
        let encodedFile = response['file']
        let encodedData = response['data']
        if(encodedData.type.includes('image')){
          this.isImage = true;
          this.myImage = 'data:image/jpeg;base64,' + encodedFile;
        }
        else if(encodedData.type.includes('video')){
          this.isVideo = true;
          this.myVideo = 'data:video/mp4;base64,' + encodedFile;
        }
        else if(encodedData.type.includes('pdf')){
          this.isPDF = true;
          this.myPDF = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + encodedFile);
        }
        this.dataIsFull = true;
        this.data = encodedData;
      },
      (error) => {
        console.error('Error getting picture data:', error);
      }
    );
  }
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.tempData = JSON.parse(JSON.stringify(this.data));
    } else {
      this.data.name = this.tempData.name;
      this.data.description = this.tempData.description;
      this.data.date_modified = new Date();
      this.fileService.updateFile(this.data);
    }
  }
  cancelEdit() {
    this.isEditMode = false;
    this.tempData = JSON.parse(JSON.stringify(this.data));
  }

  updateDescription(event:any) {
    this.tempData.description = event.target.value;
  }

  updateName(event:any) {
    this.tempData.name = event.target.value;
  }


}
