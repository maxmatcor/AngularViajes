import { Injectable, Inject, forwardRef } from '@angular/core';
import { destinoModel } from './destino-viaje.model';
import { Store } from '@ngrx/store';
import {
  NuevoDestinoAction,
  ElegidoFavoritoAction,
} from './destinos-viajes-state.model';
import { AppState, APP_CONFIG, AppConfig, db } from './../app.module';
import {
  HttpRequest,
  HttpHeaders,
  HttpClient,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';

@Injectable()
export class DestinosApiClient {
  destinos: destinoModel[] = [];

  constructor(
    private store: Store<AppState>,
    @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
    private http: HttpClient
  ) {
    this.store
      .select((state) => state.destinos)
      .subscribe((data) => {
        console.log('destinos sub store');
        console.log(data);
        this.destinos = data.items;
      });
    this.store.subscribe((data) => {
      console.log('all store');
      console.log(data);
    });
  }

  getById(id: string): destinoModel {
    return this.destinos.filter(function (d) {
      return d.id.toString() === id;
    })[0];
  }

  getAll(): destinoModel[] {
    return this.destinos;
  }

  elegir(d: destinoModel) {
    // aqui incovariamos al servidor
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

  add(d: destinoModel) {
    const headers: HttpHeaders = new HttpHeaders({
      'X-API-TOKEN': 'token-seguridad',
    });
    const req = new HttpRequest(
      'POST',
      this.config.apiEndpoint + '/my',
      { nuevo: d.nombre },
      { headers: headers }
    );
    this.http.request(req).subscribe((data: HttpResponse<{}>) => {
      if (data.status === 200) {
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db;
        myDb.destinos.add(d);
        console.log('todos los destinos de la db!');
        myDb.destinos.toArray().then((destinos) => console.log(destinos));
      }
    });
  }
}
