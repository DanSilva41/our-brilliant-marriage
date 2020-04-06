import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MessageService} from '../../messages/message.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public registerErrors: string;

  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }

  private initRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
  }

  public onRegister() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.registerErrors = 'As senhas não correspondem!';
      this.registerForm.controls.password.setErrors({password: true});
      this.registerForm.controls.confirmPassword.setErrors({confirmPassword: true});
    } else {
      this.authenticationService.emailSignUp(this.registerForm.value.firstName, this.registerForm.value.lastName, this.registerForm.value.email, this.registerForm.value.password)
        .then(
          () => {
            this.loginForm.setValue({email: this.registerForm.value.email, password: ''});
            this.initRegisterForm();
            this.router.navigate(['/home']).then(() => this.messageService.add('Conta criada com sucesso!'));
          },
          (error) => {
            this.registerErrors = error.message;
            if (error.code === 'auth/weak-password') {
              this.registerForm.controls.password.setErrors({password: true});
              this.registerForm.controls.confirmPassword.setErrors({confirmPassword: true});
            }
            if (error.code === 'auth/email-already-in-use') {
              this.registerForm.controls.email.setErrors({email: true});
            }
          }
        );
    }
  }

  public onLogin() {
    this.authenticationService
      .emailLogin(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        () => {
          this.messageService.add('Bem-vindo!');
          this.router.navigate(['/home']);
        },
        (error) => {
          if (error.code === 'auth/user-not-found') {
            this.loginForm.controls.email.setErrors({email: true});
          }
          if (error.code === 'auth/wrong-password') {
            this.loginForm.controls.password.setErrors({password: true});
          }
        }
      );
  }
}
