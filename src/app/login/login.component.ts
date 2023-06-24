import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito.service';
import { Router } from '@angular/router';
import { IUser, newIUser } from '../model/User';
import { FormControl, FormGroup } from '@angular/forms';
import {Auth} from "aws-amplify";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  isCreated : boolean = false;
  userForm!: FormGroup;

  constructor(private router: Router, private cognitoService : CognitoService){}

  ngOnInit() {
    const signUpButton = document.getElementById('signUp') as HTMLElement | any;
    const signInButton = document.getElementById('signIn') as HTMLElement | any;
    const container = document.getElementById('container') as HTMLElement | any;

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
    this.userForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      name: new FormControl(''),
      family_name : new FormControl(''),
      code: new FormControl('')
    });
  }

  signUp() {
    const user: IUser = this.userForm.value;
    this.cognitoService.signUp(user).then(()=>{
      this.isCreated = true;
      var newUser : newIUser = {
        name: user.name,
        family_name : user.family_name,
        username : user.username,
        password : user.password,
        folders : ['bucket-tim19/'+ user.username]
    }
    this.cognitoService.uploadUser(newUser);
  


    }).catch((error) =>{
        alert(error)
    } )
  }

  verify() {
    const user: IUser = this.userForm.value;

    this.cognitoService.verify(user).then(()=>{
      this.isCreated = false;

      window.location.reload();
    }).catch((error) =>{
        alert(error)
    } )

  }

  signIn() : void {
    const user: IUser = this.userForm.value;
    this.cognitoService.signIn(user).then(()=>{
      this.router.navigate(['/home']);
    }).catch((error)=>{
      alert(error);
    })

  }

}
