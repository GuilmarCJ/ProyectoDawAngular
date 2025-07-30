import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h2>Bienvenido, {{ userData.nombre }}</h2>
      <p>Local: {{ userData.local }}</p>
      <p>Almacén: {{ userData.almacen }}</p>
      
      <h3>Materiales</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Descripción</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let material of userData.materiales">
            <td>{{ material.id }}</td>
            <td>{{ material.material }}</td>
            <td>{{ material.descripcion }}</td>
            <td>{{ material.cantidad }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  `]
})
export class DashboardComponent {
  userData: any;

  constructor() {
    const savedData = localStorage.getItem('userData');
    this.userData = savedData ? JSON.parse(savedData) : {};
  }
}