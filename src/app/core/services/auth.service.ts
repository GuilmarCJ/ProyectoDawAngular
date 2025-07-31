import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginResponse {
  mensaje: string;
  nombreCompleto: string;
  local: string;
  almacen: string;
  materiales: Material[];
}

export interface Material {
  id: number;
  material: string;
  descripcion: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`, 
      { username, password }
    );
  }

  logout(): void {
    // Elimina los datos de usuario del localStorage
    localStorage.removeItem('userData');
    
    // Redirige al login
    this.router.navigate(['/login']);
  }
}