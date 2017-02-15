import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

export type InternalStateType = {
  [key: string]: any
};

const currencies = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

@Injectable()
export class AppState {

  constructor(private http: Http) {}

  public getCurrencies() {
      const date = new Date();
      return this.http.get(`${currencies}?nocache=${date}`);
  }

  public _state: InternalStateType = { };

  // already return a clone of the current state
  public get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }
}
