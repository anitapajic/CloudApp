import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito.service';
import { Route, Router } from '@angular/router';
import { IUser } from '../model/User';
import { FormControl, FormGroup } from '@angular/forms';

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
      code: new FormControl('')
    });
  }

  signUp() {
    const user: IUser = this.userForm.value;
    console.log(user)
    this.cognitoService.signUp(user).then(()=>{
      this.isCreated = true;
    }).catch((error) =>{
        alert(error)
    } )
  }

  verify() {
    const user: IUser = this.userForm.value;
    this.cognitoService.verify(user).then(()=>{
      this.isCreated = false;
    }).catch((error) =>{
        alert(error)
    } )

  }

  signIn() {
  }

}
