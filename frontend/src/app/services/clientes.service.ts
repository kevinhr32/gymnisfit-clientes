import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, DatosCliente } from '../models/cliente.model';

export const API_CLIENTES_URL = 'http://localhost:3000/api/clientes';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(API_CLIENTES_URL);
  }

  crear(datos: DatosCliente): Observable<Cliente> {
    return this.http.post<Cliente>(API_CLIENTES_URL, datos);
  }

  actualizar(id: string, datos: DatosCliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${API_CLIENTES_URL}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${API_CLIENTES_URL}/${id}`);
  }
}
