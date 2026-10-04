export type Plan = 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';

export type EstadoCliente = 'ACTIVO' | 'POR_VENCER' | 'VENCIDO';

export interface Cliente {
  _id: string;
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  plan: Plan;
  fechaVencimiento: string;
  estado: EstadoCliente;
  createdAt: string;
  updatedAt: string;
}

export interface DatosCliente {
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  plan: Plan;
  fechaVencimiento: string;
}
