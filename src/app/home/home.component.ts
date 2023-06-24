import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  isActiveDash:boolean =true;
  isActiveFolder:boolean =false;
  isActiveFav:boolean =false;  
  folders : string[] = new Array();
  previousFolder!: string;
  currentFolder! :string;
  rootFolder!: string;

  constructor(private fileService: FileService, private cognito: CognitoService) { }
  ngOnInit(): void {
    this.cognito.getUser().then((user)=>{
      this.currentFolder = user.attributes['email'];
      this.rootFolder = this.currentFolder;
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
    )


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
    return !obj.includes('.');
  }

  changeFolder(obj : string){
    this.folders = [];

    if(obj == '/'){
      this.currentFolder = this.previousFolder;
      this.previousFolder = this.rootFolder;
    }
    else{
      this.previousFolder = this.currentFolder;
      this.currentFolder = this.currentFolder + "%2F" + obj;
    }
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
  
}
