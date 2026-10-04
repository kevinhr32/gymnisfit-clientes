import { Component } from '@angular/core';
import { ClientesComponent } from './components/clientes/clientes.component';

@Component({
  imports: [ClientesComponent],
  selector: 'app-root',
  template: '<app-clientes />',
})
export class App {}
