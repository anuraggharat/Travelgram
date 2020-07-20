import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {ToastrService} from 'ngx-toastr'
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email=null
  uid=null
  user=null
  constructor(
    private auth:AuthService,
    private router:Router,
    private toastr:ToastrService,
    private db:AngularFireDatabase
  ) { 

    auth.getUser().subscribe(
      (user)=>{
        console.log(user);
        this.email=user?.email
        this.uid=user?.uid
        db.object(`/users/${this.uid}`)
        .valueChanges()
        .subscribe((user)=>{
          this.user=user    
        })
      }
    )

  }

  ngOnInit(): void {
  }

  async handleSignout(){
    try {
      const res=await this.auth.signOut()
      this.router.navigateByUrl('/signin')
      this.toastr.info('Logout Success')
      this.email=null
    } catch (error) {
      this.toastr.error('Problem signing out')
    }
  }



}
