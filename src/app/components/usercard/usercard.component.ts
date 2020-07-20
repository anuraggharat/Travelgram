import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-usercard',
  templateUrl: './usercard.component.html',
  styleUrls: ['./usercard.component.css']
})
export class UsercardComponent implements OnInit {

  user=null
  uid=null
  constructor(
    private auth:AuthService,
    private db:AngularFireDatabase
  ) {

    auth.getUser().subscribe((user)=>{
      this.uid=user?.uid
      db.object(`/users/${this.uid}`)
      .valueChanges()
      .subscribe((currentUser)=>{
        console.log(currentUser)
        this.user=currentUser
      })
    })

   }

  ngOnInit(): void {
  }

}
