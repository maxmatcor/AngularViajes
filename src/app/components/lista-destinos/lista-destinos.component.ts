import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { destinoModel } from '../../models/destino-viaje.model';
import {
  ElegidoFavoritoAction,
  NuevoDestinoAction,
} from '../../models/destinos-viajes-state.model';
import { DestinosApiClient } from '../../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
})
export class ListaDestinosComponent implements OnInit {
  // destinoList: destinoModel[];
  @Output() onItemAdded: EventEmitter<destinoModel>;
  updates: string[];
  all;
  constructor(
    public destinosApiClient: DestinosApiClient,
    private store: Store<AppState>
  ) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];
    this.store
      .select((state) => state.destinos.favorito)
      .subscribe((d) => {
        if (d != null) {
          this.updates.push('Se eligio a ' + d.destino);
        }
      });
    store
      .select((state) => state.destinos.items)
      .subscribe((items) => (this.all = items));
  }
  ngOnInit() {}

  agregado(list: destinoModel) {
    this.destinosApiClient.add(list);
    this.onItemAdded.emit(list);
  }

  elegido(e: destinoModel) {
    this.destinosApiClient.elegir(e);
  }

  getAll() {}
  // agregado(destino: string, place: string, date: string): boolean {
  // 	this.destinoList.push(new destinoModel(destino, place, date));
  // 	console.log(this.destinoList);
  // 	return false;
  // }

  // elegido(list: destinoModel) {
  // 	this.destinoList.forEach(function(x) {
  // 		x.setSelected(false);
  // 	});
  // 	list.setSelected(true);
  // }
}
