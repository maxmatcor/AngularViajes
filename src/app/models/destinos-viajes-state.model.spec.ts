import {
  reducerDestinosViajes,
  DestinosViajesState,
  intializeDestinosViajesState,
  InitMyDataAction,
  NuevoDestinoAction,
} from './destinos-viajes-state.model';
import { destinoModel } from './destino-viaje.model';

describe('reducerDestinosViajes', () => {
  it('should reduce init data', () => {
    const prevState: DestinosViajesState = intializeDestinosViajesState();
    const action: InitMyDataAction = new InitMyDataAction([
      'destino 1',
      'destino 2',
    ]);
    const newState: DestinosViajesState = reducerDestinosViajes(
      prevState,
      action
    );
    expect(newState.items.length).toEqual(2);
    expect(newState.items[0].destino).toEqual('destino 1');
  });

  it('should reduce new item added', () => {
    const prevState: DestinosViajesState = intializeDestinosViajesState();
    const action: NuevoDestinoAction = new NuevoDestinoAction(
      new destinoModel('barcelona', 'url', '')
    );
    const newState: DestinosViajesState = reducerDestinosViajes(
      prevState,
      action
    );
    expect(newState.items.length).toEqual(1);
    expect(newState.items[0].destino).toEqual('barcelona');
  });
});
