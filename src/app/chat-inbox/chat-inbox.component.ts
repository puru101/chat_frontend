
//https://medium.com/@udara201/real-time-chat-application-with-socket-io-angular-and-nodejs-83f1a85d5024

import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import {  Input } from '@angular/core';
import { ChatserviceService } from '../chatservice.service';
import { catchError, map, tap } from 'rxjs/operators';

const SOCKET_ENDPOINT = 'localhost:3000';


@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit {
  @Input() loginUser: any;
  socket;
  isButtonDisable=false;
  message;
  currentDate;
  userList:[];
  conversations:[];
  replyList:[];
  chatBox=false;
  listOReply:[];
  selectedUser:any;
  selectedConversation:any;
  firstConversation:any;
  currentReply:any;
  constructor(private myservice: ChatserviceService) {

  }

ngOnInit() {
  this.setupSocketConnection();
  this.currentDate = this.myservice.todayDate();
  console.log("loginUser chat inbox: ",this.loginUser);

  //this.getLoginUser(loginUser.);
  this.myservice.getUserList().subscribe(result => {
    console.log('Section result', result);
    this.userList = result; 
});
  
}


selectUser(user:any) {
 console.log("selected user:",this.selectedUser)
  
  if(this.selectedUser== null || user.user_id!=this.selectedUser.user_id){
    //document.getElementById('message-list').innerHTML="<li></li>";
    this.selectedConversation=null;
    this.replyList=null;
    this.selectedUser=user;
    console.log("selected user:",this.selectedUser)
    console.log("to send from loginUser:",this.loginUser)
    this.chatBox=true;
    this.getSelectUserConversation(user); 
  }

}


getSelectUserConversation(user:any){
 // console.log("fetching list of user",user);
  //console.log("fetching list of loginUser",this.loginUser);
  this.myservice.getSelectUserConversation(user,this.loginUser).subscribe(result => {
    console.log('conversation result ::', result);
    if(result!=null ){
      this.getListOfReply(result.id);
      this.selectedConversation = result; 
    }
  
});

}

// getConversations(user:any){
//   this.myservice.getConversations(user).subscribe(result => {
//     console.log('conversation result', result);
//     this.conversations = result; 
// });
// }

getListOfReply(conversationId:any){
  this.myservice.getUserReply(conversationId).subscribe(result => {
    console.log('replyList result', result);
    this.replyList = result; 
    const messageNode =document.getElementById('message-list')
    for (let reply of result) {
      const element = document.createElement('div');
      if(reply.user_id== this.loginUser.user_id){
        element.innerHTML = '<div class="cg-comment presenter">  <span>   '+this.loginUser.username+'</span><div> <p> '+reply.reply+'</p> <label for=""> '+reply.date_time +'</label></div></div>';
        messageNode.appendChild(element);
      }else{
        element.innerHTML = '<div class="cg-comment receiver">  <span>   '+reply.username+'</span><div> <p> '+reply.reply+'</p> <label for=""> '+reply.date_time +'</label></div></div>';
        messageNode.appendChild(element);
      }
      
      //const element = document.createElement('li');      
   
    }


});
}
// element.innerHTML = entry.reply;
// element.style.background = 'white';
// element.style.padding =  '15px 30px';
// element.style.margin = '10px';
// element.style.textAlign = 'right';
// document.getElementById('message-list').appendChild(element);

//   console.log(entry); // 1, "string", false

setupSocketConnection() {
  this.socket = io(SOCKET_ENDPOINT);
  this.socket.on('message-broadcast', (data: string) => {
    console.log(data);

  if (data) {
    const messageNode =document.getElementById('message-list')

  const element = document.createElement('div');
  element.innerHTML = '<div class="cg-comment presenter">  <span>   '+this.loginUser.username+'</span><div> <p> '+data+'</p> <label for=""> '+222 +'</label></div></div>';
  messageNode.appendChild(element);
  // const element = document.createElement('li');
  //  element.innerHTML = data;
  //  element.style.background = 'white';
  //  element.style.padding =  '15px 30px';
  //  element.style.margin = '10px';
  //  document.getElementById('message-list').appendChild(element);
   }
 });
}


SendMessage() {

  if(this.replyList==null){
    console.log("reply message for sent is null:",this.replyList)
    console.log("reply message for sent is loginUser:",this.loginUser)
    console.log("reply message for sent is selectUser:",this.selectedUser)
    //this.myservice.getSelectUserConversation(user,this.loginUser).subscribe(result => {
    this.myservice.postConversattion(this.loginUser, this.selectedUser)
      .subscribe(data => {
        this.isButtonDisable=true;
        this.selectedConversation = data;
        console.log("First conversation: ", data)
      });
  }

  const messageNode =document.getElementById('message-list')

  const element = document.createElement('div');
  this.socket.emit('message', this.message);


  // console.log("message from loginUser:",this.message)

  // const element = document.createElement('li');
  // element.innerHTML = this.message;
  // element.style.background = 'white';
  // element.style.padding =  '15px 30px';
  // element.style.margin = '10px';
  // element.style.textAlign = 'right';
  // document.getElementById('message-list').appendChild(element);

  this.myservice.postReplyMessage(this.selectedConversation.id,this.selectedUser, this.message).pipe(map((res) => res.response))
  .subscribe(data => this.currentReply = data);


    element.innerHTML = '<div class="cg-comment presenter">  <span>   '+this.loginUser.username+'</span><div> <p> '+this.message+'</p> <label for=""> '+222 +'</label></div></div>';
    messageNode.appendChild(element);
 
  console.log("current reply:",this.currentReply)
  this.message = '';
}


}
