import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {NgForm} from '@angular/forms'
import {finalize} from 'rxjs/operators'
import { AngularFireStorage } from "@angular/fire/storage";
import {AngularFireDatabase} from '@angular/fire/database'
import { readAndCompressImage } from 'browser-image-resizer';
import {imageconfig} from '../../../Utils/config'





@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture:string="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAB7CAMAAACfDCSHAAAAdVBMVEX////S19sREiQAAAD29vbP1Nj7/Pzx8/QMDSHm6eva3uHf4uXW2t7s7vAAABvi5ehVVl8tLjpbXGQiIzEeHis9PUVjZGozNEBFRUwwMDiRkpWAgYR0dXptbXFPUVaHh4yZm54YGCdKS1Wnp6wAABR9foYAAAoIwesrAAAERElEQVRoge1a2XabMBC1KKvBGLDBjoOd4Ib+/yeWxVuQ5moQjk97DvchdR/E1czcWYRYLGbMmDHjv4Frex1s9wVkthcsI+GICxwRLQPP/jE611s3bDe6G23Du/Z+wF7XC4XE9sArwiezukEE+C6sUfA8UjdABj6a+ixSJmFPunoCoadyqePIMrq615vKGCoUGoXBarUKwkjJ64TTTFQ88MF1jYyVxk4wNBg+0FkP9dFIS2FoYMo4NMFZqgTpKiw1dK471A2599VaKhNOZJAubjTcOdK/ux6aOp5TZtTER4r7WE6Zca1bshwGdCSntF5o168kFUVjGCUROoxUk3Y5RrdSXFgbDmVOdn56cpHjVGt5oyzndJBWCoejBHmnDXiMsoN4K21Vy2GFU7VZ1kJX2Vc4rh1mZAuWDJSUHOHJ6TWNUq88V7VsCqW+iCiULqbEUp+caiMFa3SjrNSYqTaSJzxVkujNlBrIGEplKWgBWwq5ilPxlFrX7ldVeKZTIvWRfmVRUjoQSECkX1ltaE0yAs/SizjFgIyKEPQUQ/qVRSkPLzeQhdam13CaEPCRoM72IJS87k7vmFpPS445q9GZScWFDgZzVKMzc0msoNUz1UryASQjd2pSHfzgA8jm08SCR0lnJjEiohzhKRbktTpL5FP6HbyxG7w5Ue8ZUVKK+wZaPSaUrGCCImtCyWheQH4mlHSVvDOCsm5GqbOTmg0hJUgSoW/S1Hx3gdpJMBaozXYAY4igT4uQUZcnMJJkxQTFowUcujWhpMo6yiudflAZEHT3w+HAnsV+JbVHDyL9OpCaGr2SbQFnCTRTIx5aBxr90C1M/Sb4Dnqq0ASTjIhGrugFIC555pTgzTd9DMKUmiICD5ho4EaZqREBqpVY67R8NFkJGx/eLrkU1y08BeO6RYYESl3TaaGA6FIA65buhTfYL2jSKEu0B3BgJlIBOs4avJW/AnUSehVnNqQ2DA8JtHM4QzeRm5qjOyUgnJNXSHdJDMa2PiuXaW90eihWLvVHL/naqwWPUXKtE/E+VpDuAplubfFNfxwLb5tdfiNlXa9ccPfR2Ovsx9tybiB7XCYLJxp/ae9dLR15Veu26xpCo08T7G7D6mtkDaf5txBNTEcztpqf9PGFF77iW6AZM2bMmDFjxowZ/wbsl2Px6+VYWJblW3f40o+nY9E93vcbiuavH29iP27+seLNT1LGyTbLt3mx26dvh/fyeMrz08c+25o+st1zu/vuj9X/vqGn9PfnsjieimJfZsVnXR8+PnOniI0Zd1me5mmanHfpLqvSXb47J8fiVGRZVpzj3rF+nRTn5NxQ5ll9qA+Hz+T3x5cx5aauj2X5XtR1WRySY1mXSVZn5fsxa35dKTdxvsnTbV5Z6f7P5q2q8io1ZWzQeTNuHWzF3X+tyq++4k315bfR6uXTiacVqd/96PT0dFwfuXj+o3X4Cys2ONTa2VGjAAAAAElFTkSuQmCC"
  uploadPercent:number=null


  constructor
  (
    private auth:AuthService,
    private router:Router,
    private db : AngularFireDatabase,
    private storage : AngularFireStorage,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
    const {email,password,username,country,bio,name} = f.form.value
    
    this.auth.signUp(email,password)
    .then(res=>{
      console.log(res);
      const {uid}= res.user
      this.db.object(`/users/${uid}`)
      .set({
        id:uid,
        name:name,
        email:email,
        instaUserName:username,
        country:country,
        bio:bio,
        picture:this.picture
      })
    })
    .then(
      ()=>{this.router.navigateByUrl('/')
    this.toastr.success('Signup Success')}
    )
    .catch(
      (err)=>this.toastr.error(err.message)
    )
  
  
  
  }

  async uploadFile(event){
    const file=event.target.files[0]
    let resizedImage=await readAndCompressImage(file,imageconfig)
    const filePath=file.name
    //rename the image with uuid
    const fileRef=this.storage.ref(filePath)

    const task = this.storage.upload(filePath,resizedImage)
    task.percentageChanges().subscribe(
      (percent)=>{
        this.uploadPercent=percent
      }
    )
    task.snapshotChanges()
    .pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe(
          (url)=>{
            this.picture=url
            this.toastr.success('Profile Picture Success')
          }
        )
      })
    )  
    .subscribe()

  }

}
