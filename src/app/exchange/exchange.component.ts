import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppState } from '../app.service';
import { currencyTypes } from './currency/currencyTypes';

import { EUR, USD, GBP, ICurrency } from './currencies';

const currencyArr = ['EUR', 'USD', 'GBP'];
const currencyObj = {EUR, USD, GBP};
const INTERVAL = 900000;

@Component({
  selector: 'exchange',
  styleUrls: ['exchange.style.css'],
  templateUrl: './exchange.template.html'
})
export class ExchangeComponent implements OnInit {
  public form: FormGroup;
  public currencies: any = {};
  public currentCurrency: ICurrency = <ICurrency> EUR;
  public exchangeCurrency: ICurrency = <ICurrency> GBP;
  public activeCurrency: string = this.currentCurrency.name;
  public unactiveCurrency: string = this.exchangeCurrency.name;

  constructor(private appState: AppState,
              private formBuilder: FormBuilder) {}

  public ngOnInit() {
    setInterval(() => {
      this.appState.getCurrencies()
        .subscribe((responce) => {
          this.setCurrencies(responce);
          this.handleForm();
        });
    }, INTERVAL);

    this.appState.getCurrencies()
      .subscribe((responce) => {
        this.setCurrencies(responce);
        this.initializeForms();
      });
  }

  public setActiveType(type: string) {
    const active = type;
    const unactive = this.activeCurrency;

    if (active === unactive) {
      return;
    }

    this.unactiveCurrency = unactive;
    this.activeCurrency = active;
  }

  public previousCurrency(current: ICurrency, flag: string) {
    const currIndex = this.findIndex(current);
    const prevCurrency = currIndex === 0
                    ? currencyArr[currencyArr.length - 1]
                    : currencyArr[currIndex - 1];

    this.changeCurrency(prevCurrency, flag, 'prev');
    this.handleForm();
  }

  public nextCurrency(current: ICurrency, flag: string) {
    const currIndex = this.findIndex(current);
    const nextCurrency = currIndex === currencyArr.length - 1
                    ? currencyArr[0]
                    : currencyArr[currIndex + 1];

    this.changeCurrency(nextCurrency, flag, 'next');
    this.handleForm();
  }

  private findIndex(current: ICurrency): number {
    return _.findIndex(currencyArr, (currency) => {
                        return currency === current.name;
                      });
  }

  private changeCurrency(currency: string, flag: string, direction: string) {
    if (flag === 'current') {
      if (this.exchangeCurrency.name === currency && direction === 'prev') {
        return this.previousCurrency(currencyObj[currency], flag);
      } else if (this.exchangeCurrency.name === currency && direction === 'next') {
        return this.nextCurrency(currencyObj[currency], flag);
      }
      this.currentCurrency = currencyObj[currency];
      this.activeCurrency = currencyObj[currency].name;
    } else {
      if (this.currentCurrency.name === currency && direction === 'prev') {
        return this.previousCurrency(currencyObj[currency], flag);
      } else if (this.currentCurrency.name === currency && direction === 'next') {
        return this.nextCurrency(currencyObj[currency], flag);
      }
      this.exchangeCurrency = currencyObj[currency];
      this.unactiveCurrency = currencyObj[currency].name;
    }
  }

  private setCurrencies(currenciesXml: any) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(currenciesXml._body, 'text/xml');
      const nodes = xmlDoc.getElementsByTagName('Cube');

      _.forEach(nodes, (node: any) => {
        const currencyProp = node.attributes.currency;
        const rateProp = node.attributes.rate;
        if (currencyProp) {
          this.currencies[currencyProp.nodeValue] = rateProp.nodeValue;
        }
      });

      this.setRates();
  }

  private setRates() {
    EUR.USD = this.currencies.USD;
    EUR.GBP = this.currencies.GBP;

    USD.EUR = 1 / this.currencies.USD;
    USD.GBP = this.currencies.GBP / this.currencies.USD;

    GBP.EUR = 1 / this.currencies.GBP;
    GBP.USD = this.currencies.USD / this.currencies.GBP;
  }

  private initializeForms() {
    this.form = this.formBuilder.group({
      currentModel: [''],
      exchangeModel: ['']
    });

    this.form.valueChanges
        .subscribe((value) => {
          this.handleForm();
        });
  }

  private handleForm() {
    this.setRates();
    const currentModel = this.form.get('currentModel');
    const exchangeModel = this.form.get('exchangeModel');
    const isCurrent = this.currentCurrency.name === this.activeCurrency;
    let currentValue = isCurrent
          ? currentModel.value * this.currentCurrency[this.unactiveCurrency]
          : exchangeModel.value * this.exchangeCurrency[this.unactiveCurrency];

    if (currentValue) {
      currentValue = +currentValue.toFixed(5);
    }

    if (isCurrent) {
      exchangeModel.setValue(currentValue, {emitEvent: false});
    } else {
      currentModel.setValue(currentValue, {emitEvent: false});
    }
  }
}
