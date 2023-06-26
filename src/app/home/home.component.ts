import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FileService } from '../services/file.service';
import { CognitoService } from '../services/cognito.service';
import { newIUser } from '../model/User';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';
import {metaIFile} from "../model/File";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  isActiveDash:boolean =true;
  isActiveFolder:boolean =false;
  isActiveFav:boolean =false;
  
  rootFolder!: string;

  previousFolder!: string;
  currentFolder! :string;
  folders : string[] = [];
  sharedFolders : string[] = [];



  myImage! : SafeResourceUrl ;
  data! : metaIFile;
  page : string = 'main';
  isEditMode = false;

  constructor(private router: Router, private fileService: FileService, private cognito: CognitoService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {

    this.cognito.getUser().then((user)=>{      
      this.rootFolder = user.attributes['email'];
      this.currentFolder = this.rootFolder;
      this.getFolders()
    }
    )
  }

  getFolders(){
    this.fileService.getFolders(this.currentFolder)
    .subscribe(
      (folders: any) => {
        this.folders = folders['files'];
        },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getShared(){
    // rootFolder je username
    this.cognito.getUserData(this.rootFolder).subscribe(
      (response : any) => {
        this.folders = response.data['folders']
    });
  }

  // selectedButton: string = 'dashboard';

  // selectButton(button: string): void {
  //   this.selectedButton = button;
  // }
  // activityStatus(){
  //   this.isActiveDash = false
  //   this.isActiveFolder = true
  // }

  // handleClick(item: any) {
  //   console.log("Clicked:", item);
  //   // Handle the click event for the clicked item here
  // }

  isFile(obj: string): boolean {
    if( obj.includes('.')){
      let extension = obj.split('.')[1]
      return extension != 'com'
    }
    return false;
  }

  goBack(){
    this.currentFolder = this.previousFolder;
    if (this.currentFolder == ''){
      this.getShared();
      return 
    }
    let index = this.previousFolder.lastIndexOf("%2F")
    this.previousFolder = this.previousFolder.substring(0 , index);
  }

  next(obj : string){
    console.log('obj  ', obj)
    this.previousFolder = this.currentFolder;
    if (this.currentFolder == ""){
      console.log(obj)
      this.currentFolder = obj.replace('/', '%2F');

    }else{
      this.currentFolder = this.currentFolder + "%2F" + obj;

    }
  }

  changeFolder(obj : string){

    this.folders = [];

    if(obj == '/'){
      this.goBack()
      if (this.currentFolder == ''){
        return
      }
    }

    else{
      this.next(obj)
    }


    console.log(this.currentFolder,  "  current")
    this.fileService.getFolders(this.currentFolder)
    .subscribe(
      (folders: any) => {
        this.folders = folders['files'];
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
        this.myImage = 'data:image/jpeg;base64,' + encodedFile;
        this.data = encodedData;
      },
      (error) => {
        console.error('Error getting picture data:', error);
      }
    );
  }
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  changePage(page : string){
    this.folders = []
    this.page = page;
    if (page == 'shared'){
      this.currentFolder = ""
      this.previousFolder = this.currentFolder;
      this.getShared()
    }
    else{
      this.currentFolder = this.rootFolder;
      this.previousFolder = this.currentFolder;
      this.getFolders()

    }
    console.log(this.rootFolder)
    console.log(this.currentFolder)


  }

  logout(){
    this.router.navigate(['/']);
  }
}
