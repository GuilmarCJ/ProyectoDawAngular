import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginResponse } from '../../../../core/services/auth.service';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgIf],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div 
        @fadeInUp
        class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500"
        [class.shake]="shakeForm"
      >
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 class="text-3xl font-bold">Bienvenido</h1>
          <p class="opacity-90">Ingresa tus credenciales</p>
        </div>

        <form 
          (ngSubmit)="onSubmit()" 
          class="p-8 space-y-6"
          #loginForm="ngForm"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              [class.border-red-500]="usernameInvalid()"
              (input)="validateUsername()"
            >
            <div 
              @fadeIn
              *ngIf="usernameInvalid()"
              class="text-red-600 text-sm mt-1"
            >
              El usuario es requerido
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                [class.border-red-500]="passwordInvalid()"
                (input)="validatePassword()"
              >
              <button
                type="button"
                class="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                (click)="togglePasswordVisibility()"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div 
              @fadeIn
              *ngIf="passwordInvalid()"
              class="text-red-600 text-sm mt-1"
            >
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <button
            type="submit"
            [disabled]="loading() || formInvalid()"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            <span *ngIf="!loading()">Ingresar</span>
            <span *ngIf="loading()">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>

          <div 
          @fadeIn
          *ngIf="errorMessage()"
          class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center"
        >
          {{ errorMessage() }}
        </div>

        <div 
          @fadeIn
          *ngIf="successMessage()"
          class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center"
        >
          {{ successMessage() }}
        </div>
        </form>

        <div class="px-8 pb-6 text-center">
          <p class="text-gray-600 text-sm">¿No tienes cuenta? 
            <a routerLink="/register" class="text-blue-600 hover:underline">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  shakeForm = false;
  
  // Señales reactivas
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  usernameInvalid = signal(false);
  passwordInvalid = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Efecto para animación de error
    effect(() => {
      if (this.errorMessage()) {
        this.shakeForm = true;
        setTimeout(() => this.shakeForm = false, 500);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateUsername() {
    this.usernameInvalid.set(this.username.length === 0);
  }

  validatePassword() {
    this.passwordInvalid.set(this.password.length < 6);
  }

  formInvalid(): boolean {
    return this.username.length === 0 || this.password.length < 6;
  }

  onSubmit() {
    if (this.formInvalid()) return;
    
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.loading.set(false);
        this.successMessage.set(response.mensaje);
        
        localStorage.setItem('userData', JSON.stringify({
          nombre: response.nombreCompleto,
          local: response.local,
          almacen: response.almacen,
          materiales: response.materiales
        }));
        
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set('Usuario o contraseña incorrectos');
      }
    });
  }
}