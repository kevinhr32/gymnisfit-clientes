import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { Cliente, DatosCliente, Plan } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);

  readonly planes: Plan[] = ['MENSUAL', 'TRIMESTRAL', 'ANUAL'];
  clientes: Cliente[] = [];
  formulario: DatosCliente = this.formularioVacio();
  cargando = false;
  guardando = false;
  modoEdicion = false;
  clienteEditandoId: string | null = null;
  mensajeError = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.clientesService
      .listar()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (clientes) => (this.clientes = clientes),
        error: (error: HttpErrorResponse) => {
          this.mensajeError = this.obtenerMensajeError(
            error,
            'No se pudieron cargar los clientes. Verifica que el backend esté disponible.',
          );
        },
      });
  }

  guardarCliente(formularioCliente: NgForm): void {
    if (formularioCliente.invalid) {
      formularioCliente.control.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    const solicitud = this.modoEdicion && this.clienteEditandoId
      ? this.clientesService.actualizar(this.clienteEditandoId, this.formulario)
      : this.clientesService.crear(this.formulario);

    solicitud
      .pipe(finalize(() => (this.guardando = false)))
      .subscribe({
        next: () => {
          this.mensajeExito = this.modoEdicion
            ? 'Cliente actualizado correctamente.'
            : 'Cliente creado correctamente.';
          this.restablecerFormulario(formularioCliente);
          this.cargarClientes();
        },
        error: (error: HttpErrorResponse) => {
          this.mensajeError = this.obtenerMensajeError(error, 'No fue posible guardar el cliente.');
        },
      });
  }

  editarCliente(cliente: Cliente, formularioCliente: NgForm): void {
    this.modoEdicion = true;
    this.clienteEditandoId = cliente._id;
    this.formulario = {
      nombre: cliente.nombre,
      documento: cliente.documento,
      correo: cliente.correo,
      telefono: cliente.telefono,
      plan: cliente.plan,
      fechaVencimiento: this.formatearFechaInput(cliente.fechaVencimiento),
    };
    this.mensajeError = '';
    this.mensajeExito = '';
    formularioCliente.resetForm(this.formulario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarCliente(cliente: Cliente): void {
    const confirmar = window.confirm(`¿Deseas eliminar a ${cliente.nombre}?`);

    if (!confirmar) {
      return;
    }

    this.mensajeError = '';
    this.clientesService.eliminar(cliente._id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter((clienteActual) => clienteActual._id !== cliente._id);
        this.mensajeExito = 'Cliente eliminado correctamente.';
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError = this.obtenerMensajeError(error, 'No fue posible eliminar el cliente.');
      },
    });
  }

  cancelarEdicion(formularioCliente: NgForm): void {
    this.restablecerFormulario(formularioCliente);
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(fecha));
  }

  private formatearFechaInput(fecha: string): string {
    return new Date(fecha).toISOString().slice(0, 10);
  }

  private restablecerFormulario(formularioCliente: NgForm): void {
    this.modoEdicion = false;
    this.clienteEditandoId = null;
    this.formulario = this.formularioVacio();
    formularioCliente.resetForm(this.formulario);
  }

  private formularioVacio(): DatosCliente {
    return {
      nombre: '',
      documento: '',
      correo: '',
      telefono: '',
      plan: 'MENSUAL',
      fechaVencimiento: '',
    };
  }

  private obtenerMensajeError(error: HttpErrorResponse, mensajePredeterminado: string): string {
    return error.error?.mensaje || mensajePredeterminado;
  }
}
