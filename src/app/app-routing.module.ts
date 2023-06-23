import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ProfileComponent} from "./profile/profile.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {path : '', component: LoginComponent},
    {path : 'upload', component: UploadFileComponent},
    {path : 'home', component: HomeComponent}

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class  AppRoutingModule { }
