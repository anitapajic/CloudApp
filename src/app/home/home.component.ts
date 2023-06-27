import {Component, OnInit} from '@angular/core';
import {FileService} from '../services/file.service';
import {CognitoService} from '../services/cognito.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {metaIFile} from "../model/File";
import {Router} from '@angular/router';

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

  newFolder : string = "";
  createNew : boolean = false;

  myImage! : SafeResourceUrl ;
  myVideo! : SafeResourceUrl ;
  myPDF! : SafeResourceUrl ;
  myTXT! : SafeResourceUrl;
  myDocs! : SafeResourceUrl;
  data! : metaIFile;
  page : string = 'main';
  isEditMode = false;
  isImage = false;
  isVideo = false;
  isPDF = false;
  isTXT = false;
  isDocs = false;
  dataIsFull = false;
  tempData! : any;
  urlToDocs! : SafeResourceUrl;

  constructor(private router: Router, private fileService: FileService, private cognito: CognitoService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {

    this.isImage = false;
    this.isVideo = false;
    this.isPDF = false;
    this.isTXT = false;
    this.isDocs = false;
    this.dataIsFull = false;

    this.fileService.setHomeComponent(this)

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
    this.previousFolder = this.currentFolder;
    if (this.currentFolder == ""){
      this.currentFolder = obj.replace('/', '%2F');

    }else{
      this.currentFolder = this.currentFolder + "%2F" + obj;

    }
  }

  checkAndChangeFolder(event : any, obj: string) {
    const clickedElement = event.target as HTMLElement;
    console.log(clickedElement)
    const isLastTdClicked = clickedElement.id === 'delete';

    if (!isLastTdClicked) {
      this.changeFolder(obj);
    }
  }


  changeFolder(obj : string){

    this.folders = [];
    this.removeFile()
    if(obj == '/'){
      this.goBack()
      if (this.currentFolder == ''){
        return
      }
    }
    else{
      this.next(obj)
    }


    this.fileService.getFolders(this.currentFolder)
    .subscribe(
      (folders: any) => {
        this.folders = folders['files'];
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
        else if(encodedData.type.includes('plain')){
          this.isTXT = true;
          this.myTXT = atob(encodedFile);
        }
        else if(pictureName.includes('docx')){
          this.isDocs = true;
          this.urlToDocs = this.sanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/embed.aspx?src=https://tim19-bucket.s3.amazonaws.com/' + this.currentFolder + "%2F" + pictureName);
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
    console.log("aaaa");
    console.log(this.isEditMode);
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.tempData = JSON.parse(JSON.stringify(this.data));
      console.log("aaaa")
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

  changePage(page : string){
    this.folders = []
    this.removeFile()
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

  }

  logout(){
    this.router.navigate(['/']);
  }

  removeFile(){
    this.isImage = false;
    this.isVideo = false;
    this.isPDF = false;
    this.dataIsFull = false;
    this.isTXT = false;
    this.isDocs = false;
  }

  delete(name : string) {
    this.fileService.deleteFile(this.currentFolder + "%2F" + name).subscribe(
      (response) => {
        console.log(response);
        let data = {
          "subject" : "File deleted",
          "content" : "You successfully deleted file " + name +".",
        }
        this.fileService.sendNotification(data).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );

        this.getFolders();
        this.removeFile();
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }

  newFolderName(){
    this.createNew = !this.createNew;
  }
  updateFolderName(event:any) {
    this.newFolder = event.target.value;
  }

  createNewFolder(){
    if(this.folders.includes(this.newFolder)){
      alert("Folder already exist")
      return
    }
    if(this.newFolder.length < 1){
      alert("Enter folder name")
      return
    }
    if(this.newFolder.includes('/')){
      alert("Folder name can't include / ")
      return
    }

    let body = {
      'id' : this.currentFolder.replaceAll('%2F', '/') + '/' + this.newFolder
    }
    console.log(this.currentFolder, " after")

    this.fileService.createNewFolder(body).subscribe(
      (response) => {
        console.log(response);
        this.getFolders();
        this.newFolderName()
      },
      (error) => {
        console.error('Error creating folder:', error);
      }
    )

  }


  deleteFolder(folder : string){
    let data = {
      'id' : this.currentFolder.replaceAll('%2F', '/') + '/' +folder,
    }

    this.fileService.deleteFolder(data).subscribe(
      (response) => {
        console.log(response);
        this.getFolders();
        let data = {
          "subject" : "Folder deleted",
          "content" : "You successfully deleted folder " + folder +".",
        }
        this.fileService.sendNotification(data).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error('Error deleting folder:', error);
      }
    )
  }

  download(name:string) {
        this.fileService.downloadFile(this.currentFolder + "%2F" + name).subscribe(
          (response) => {
            let presignedUrl = response['url'];
            console.log(presignedUrl);

            let a = document.createElement('a');
            a.href = presignedUrl;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
          (error) => {
            console.log('Error downloading file:', error);
          });
  }

  
}
