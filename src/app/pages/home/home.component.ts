import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  users=[]
  posts=[];
  isLoading=false

  constructor(
    private db: AngularFireDatabase,
    private toastr:ToastrService
  ) { 
    this.isLoading=true


    //get all users
    db.object('/users')
    .valueChanges()
    .subscribe((obj)=>{
      if(obj){
        this.users=Object.values(obj)
        this.isLoading=false
      }
      else{
        this.toastr.error("No User Found")
        this.users=[]
        this.isLoading=false
      }
    })


    //grab all posts

    db.object('/posts')
    .valueChanges()
    .subscribe(obj=>{
      if(obj){
        this.posts=Object.values(obj).sort((a,b)=>b.date-a.date)
        this.isLoading=false
      }else{
        toastr.error("No posts")
        this.posts=[]
        this.isLoading=false
      }
    })



  }

  ngOnInit(): void {
  }

}
