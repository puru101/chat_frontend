import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  constructor(private httpClient: HttpClient) {}
  //apiURL: string = 'http://localhost:8080/api/chats';
  apiURL: string = 'http://localhost:8080/api/chats';
  todayDate() {
    let ndate = new Date();
    return ndate;
  }

  public getUserList(){
   // let users=
   // console.log("fetching list of users",users)
    return this.httpClient.get<any>(`${this.apiURL}/users`);
}



public getSelectUserConversation(user:any,loginUser:any):Observable<any>{
  console.log("fetching list of conversations for user",user);
  console.log("fetching list of conversations for loginUser",loginUser);
  let selectedConversation=this.httpClient.get(`${this.apiURL}/conversations/`+user.user_id+`/`+loginUser.user_id);
   console.log("fetching list of conversations",selectedConversation)
   return selectedConversation;
}

public getConversations(user:any){
  console.log("fetching list of conversations",user)
  let conversations=this.httpClient.get<any>(`${this.apiURL}/conversations/`+user.user_id);
   console.log("fetching list of conversations",conversations)
   return conversations;
}

public getUserReply(converationId:any){
  let reply=this.httpClient.get<any>(`${this.apiURL}/reply/`+converationId);
   console.log("fetching list of reply",reply)
   return reply;
}

public getUserById(loginUserId:any):Observable<any>{
  console.log("loginUserId :"+loginUserId)

   return this.httpClient.get(this.apiURL+'/users/'+loginUserId);
}

public getUserByEmailId(emailId:any):Observable<any>{
  console.log("emailId :"+emailId)
  let json= {
    "emailId":emailId,
    "password":"test"
  }
   return this.httpClient.post(this.apiURL+'/users',json);
}

public postConversattion(loginUser:any, toUser:any){
  let json= {
    "toUserId":toUser.user_id,
    "fromUserId":loginUser.user_id
  }
    return this.httpClient.post<any>(this.apiURL+'/conversations', json);
}

public postReplyMessage(conversationId:any, toUser:any,message:String){
  let json= {
    "userId":toUser.user_id,
    "reply":message,
    "conversationId":conversationId
}
    return this.httpClient.post<any>(this.apiURL+'/reply', json);
}


}
