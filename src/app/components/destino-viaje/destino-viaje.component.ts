import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Output } from '@angular/core';
import {
  Component,
  OnInit,
  Input,
  HostBinding,
  EventEmitter,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { destinoModel } from '../../models/destino-viaje.model';
import {
  VoteDownAction,
  VoteUpAction,
} from '../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css'],
  animations: [
    trigger('esFavorito', [
      state(
        'estadoFavorito',
        style({
          backgroundColor: 'PaleTurquoise',
        })
      ),
      state(
        'estadoNoFavorito',
        style({
          backgroundColor: 'WhiteSmoke',
        })
      ),
      transition('estadoNoFavorito => estadoFavorito', [animate('3s')]),
      transition('estadoFavorito => estadoNoFavorito', [animate('1s')]),
    ]),
  ],
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: destinoModel;
  @Input('index') position: destinoModel;
  @HostBinding('attr.class') cssClass = 'col-md-4';
  @Output() clicked: EventEmitter<destinoModel>;
  constructor(private store: Store<AppState>) {
    this.clicked = new EventEmitter();
  }

  ngOnInit(): void {}

  ir() {
    this.clicked.emit(this.destino);
    return false;
  }

  voteUp() {
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }
  voteDown() {
    this.store.dispatch(new VoteDownAction(this.destino));
    return false;
  }
}
