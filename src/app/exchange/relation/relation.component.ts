import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EUR, USD, GBP, ICurrency } from '../currencies';

@Component({
  selector: 'relation',
  styleUrls: ['relation.style.css'],
  templateUrl: './relation.template.html'
})
export class RelationComponent {
  @Input() public activeCurrency: string;
  @Input() public unactiveCurrency: string;

  public currencies = {EUR, USD, GBP};

  public makeFixed(value: string): number {
    return +parseFloat(value).toFixed(5);
  }
}
