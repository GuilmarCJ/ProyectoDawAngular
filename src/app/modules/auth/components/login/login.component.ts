import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Usuario:</label>
          <input type="text" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Ingresar</button>
        <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
        <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    div {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
    }
    button {
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login exitoso:', response);
        this.successMessage = response.mensaje;
        this.errorMessage = '';
        
        // Guardar datos en localStorage
        localStorage.setItem('userData', JSON.stringify({
          nombre: response.nombreCompleto,
          local: response.local,
          almacen: response.almacen,
          materiales: response.materiales
        }));
        
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.successMessage = '';
      }
    });
  }
}