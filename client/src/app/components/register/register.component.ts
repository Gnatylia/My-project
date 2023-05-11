import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user-model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _service: LoginService,
    private _r: Router
  ) { }

  public myFirstForm: FormGroup
  public mySecondForm: FormGroup

  ngOnInit(): void {
    console.log('RegisterComponent.ngOnInit');
    this.myFirstForm = this._fb.group({
      id: ["", [
        Validators.required,
        Validators.minLength(9)
      ], [this.UserIDValidator()]
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });

    this.mySecondForm = this._fb.group({
      city: ["", Validators.required],
      street: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required]
    });

  }

  UserIDValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const _userID = control.value as string;
      return this._service.getUserByID(_userID).pipe(
        map(res => {
          return (res.result) ? { "UserID": "This ID is exists!" } : null;
        })
      );
    };
  }

  public handle_submit() {
    console.log("handle_submit: this.mySecondForm = ", this.mySecondForm.invalid);
    if (this.mySecondForm.invalid) {
      return;
    }
    const { id, email, password } = this.myFirstForm.value;
    const { city, street, firstName, lastName } = this.mySecondForm.value;
    let _user: UserModel = {
      id: id,
      email: email,
      password: password,
      city: city,
      street: street,
      firstName: firstName,
      lastName: lastName
    };
    console.log("handle_submit: _user = ", _user);
    this._service.register(_user).subscribe(
      (res: any) => {
        this._r.navigateByUrl('/login')
      }, err => {
        console.log(err)
      }
    )
  };


  getErrorMessage(control: AbstractControl) {
    //console.log("getErrorMessage: errors = ", control.errors);
    let _result = '';//"Errors: ";

    for (let errorName in control.errors) {
      
      switch (errorName) {
        case "required":
          //console.log("getErrorMessage.required: _err = ", control.errors[errorName]);
          _result += "this field is required \n";
          break;
        case "minlength":
          let _err = control.errors[errorName]["requiredLength"];
          //console.log("getErrorMessage.minlength: _err = ", _err);
          _result += ("min Length is " + _err + " \n");
          break;
        case "UserID":
          _result += control.errors["UserID"];
          break;
      }
    }

    return _result;
  };

}


