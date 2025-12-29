import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf/ngClass
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
          next: (success) => {
            if (success) {
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = 'Credenciales inválidas';
            }
          },
          error: () => this.errorMessage = 'Error en el servidor'
        });
      }
    } else {
      if (this.registerForm.valid) {
        if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
          this.errorMessage = 'Las contraseñas no coinciden';
          return;
        }

        const { confirmPassword, ...newUser } = this.registerForm.value;

        this.authService.register(newUser).subscribe({
          next: () => {
            alert('Registro exitoso! Por favor inicia sesión.');
            this.toggleMode();
          },
          error: (err) => this.errorMessage = err.message || 'Error al registrar'
        });
      }
    }
  }
}
