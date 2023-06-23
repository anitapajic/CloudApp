import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  isActiveDash:boolean =true;
  isActiveFolder:boolean =false;
  isActiveFav:boolean =false;  

  ngOnInit(): void {
    
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
  
  
}
