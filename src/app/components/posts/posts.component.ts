import { Component, OnInit,Input,OnChanges } from '@angular/core';
import {faThumbsDown, faThumbsUp, faShareSquare} from '@fortawesome/free-regular-svg-icons'
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnChanges {

  @Input()
  post

  faThumbsDown=faThumbsDown
  faThumbsUp=faThumbsUp
  faShareSquare=faShareSquare

  uid=null
  upvote=0
  downvote=0

  constructor(
    private db:AngularFireDatabase,
    private auth:AuthService
  ) { 
    auth.getUser()
    .subscribe(user=>{
      this.uid=user?.uid
    })

  }
  
  ngOnInit(): void {
  }

  ngOnChanges():void{
    if(this.post.vote){
      Object.values(this.post.vote).map((val:any)=>{
        if(val.upvote){
          this.upvote +=1
        }
        if(val.downvote){
          this.downvote +=1
        }
      })
    }
  }


  upvotePost(){
    console.log("like");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote:1
    }) 
  }
  downvotePost(){
    console.log("dislike");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote:1
    }) 
  }
  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`
  }




}
