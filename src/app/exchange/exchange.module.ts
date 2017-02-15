import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { OnlyNumbersDirective } from '../directives/onlyNumbers.directive';

import { ExchangeComponent } from './exchange.component';
import { CurrencyComponent } from './currency/currency.component';
import { RelationComponent } from './relation/relation.component';
import { AppState } from '../app.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    OnlyNumbersDirective,
    ExchangeComponent,
    CurrencyComponent,
    RelationComponent
  ],
  providers: [
    AppState
  ],
  exports: [
    ExchangeComponent
  ]
})
export class ExchangeModule {}
