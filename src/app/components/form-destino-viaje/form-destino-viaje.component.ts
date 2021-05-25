import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { fromEvent } from 'rxjs';
import {
  map,
  filter,
  debounce,
  distinctUntilChanged,
  switchMap,
  debounceTime,
} from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { destinoModel } from '../../models/destino-viaje.model';
import { AppConfig, APP_CONFIG } from 'src/app/app.module';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css'],
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<destinoModel>;
  fg: FormGroup;
  minLongNombre = 3;
  serchResults: string[];
  fb: FormBuilder;

  constructor(
    fb: FormBuilder,
    @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig
  ) {
    //inicializar
    this.onItemAdded = new EventEmitter();
    //vinculacion con tag html
    this.fg = fb.group({
      destino: [
        '',
        Validators.compose([
          Validators.required,
          this.nombreValidator,
          this.nombreValidatorParametrizable(this.minLongNombre),
        ]),
      ],
      place: ['', Validators.required],
      date: [''],
    });
    //observador de tipeo
    this.fg.valueChanges.subscribe((form: any) => {
      console.log('cambio el formulario: ', form);
    });

    this.fg.controls['destino'].valueChanges.subscribe((value: string) => {
      console.log('destino cambió:', value);
    });
  }
  ngOnInit() {
    const elemNombre = <HTMLInputElement>document.getElementById('destino');
    fromEvent(elemNombre, 'input')
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter((text) => text.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) =>
          ajax(this.config.apiEndpoint + '/ciudades?q=' + text)
        )
      )
      .subscribe((ajaxResponse) => (this.serchResults = ajaxResponse.response));
  }
  guardar(destino: string, place: string, date: string): boolean {
    const d = new destinoModel(destino, place, date);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean } {
    const l = control.value.toString().trim().length;
    if (l > 0 && l < 5) {
      return { invalidNombre: true };
    }
    return null;
  }
  nombreValidatorParametrizable(mingLong: number): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } | null => {
      const l = control.value.toString().trim().length;
      if (l > 0 && l < mingLong) {
        return { minLongNombre: true };
      }
    };
    return null;
  }
}
