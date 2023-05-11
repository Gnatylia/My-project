import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login-model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  isValidError: boolean;

  constructor(
    private _fb: FormBuilder,
    private _service: LoginService,
    private _r: Router
  ) { }

  public myForm: FormGroup

  ngOnInit(): void {
    this.myForm = this._fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    })
  }


  public handle_submit() {
    const { email, password } = this.myForm.value;
    let user: LoginModel = {
      email: email,
      password: password
    };
    this._service.login(user).subscribe(
      (res) => {
        // sessionStorage
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("name", res.result);
        this.isValidError = false;
        this._service.changeLoginName(res.result);
        if (res.role == "admin") {
          this._r.navigateByUrl('/admin');
        } else {
          //this._r.navigateByUrl('/main');
        }
      }, err => {
        console.log("handle_submit.error: ", err.error);
       
        this.isValidError = true;

      }
    )
  }
}
