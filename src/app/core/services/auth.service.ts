import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la interfaz para la respuesta del login
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
  // Agrega otros campos según necesites
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`, 
      { username, password }
    );
  }
}