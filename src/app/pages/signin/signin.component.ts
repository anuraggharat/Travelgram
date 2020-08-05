import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {NgForm} from '@angular/forms'


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private auth:AuthService,
    private router:Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
    const {email,password} = f.form.value
    console.log(f);
    
    this.auth.signIn(email,password)
    .then(
      (res)=>{
        this.toastr.success("Signin Success")
        this.router.navigateByUrl('/')
      }
    )
    .catch(err=>{
      this.toastr.warning(err.message,'',{
        closeButton:true
      })
    })
  
  }


}
