import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ChatserviceService } from './chatservice.service';

@Component({
  selector: 'chat-element',
 // selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'socket-frontend';
  isLogin= false;
  isChatOn=false; 
  username ;  
  loginUser:any;
  ngOnInit() {
  }
  constructor(private myservice: ChatserviceService) {

  }
  async joinChat() {
    try {      
    

      if(this.username!=null){
        console.log(this.username);
        this.isLogin=true;
        this.isChatOn=true;
        this.getUserByEmailId(this.username);
        console.log("loginUser from join chat:",this.loginUser);
       
        
      }else{
        this.isLogin=true;
        this.isChatOn=true;
       this.getUserByEmailId(this.username);
      }
      console.log("loingUser app component: ",this.loginUser);

    } catch (err) {
      console.log(err);
      return;
    }
  }

  getLoginUser(loginUserId:any){
    this.myservice.getUserById(loginUserId).subscribe(result => {
      console.log('loginUser result ::', result);
      this.loginUser = result; 
      return result;
  });
  }

  getUserByEmailId(emailId:string){
    console.log('getUserByEmailId ::', emailId);

    this.myservice.getUserByEmailId(emailId).subscribe(result => {
      console.log('getUserByEmailId result ::', result);
      this.loginUser = result; 
      return result;
  });
  }

}
