import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICurrency } from '../currencies';

@Component({
  selector: 'currency',
  styleUrls: ['currency.style.css'],
  templateUrl: './currency.template.html'
})
export class CurrencyComponent {
  @Input() public currency: ICurrency;
  @Input() public name: string;
  @Input() public activeCurrency: string;
  @Input() public unactiveCurrency: string;
  @Input() public form: FormGroup;
  @Output() public onFocusActive = new EventEmitter();
  public isComputeResultNegative: boolean = false;
  public showRelation: boolean = false;

  public isActive(): boolean {
    return this.activeCurrency === this.currency.name;
  }

  public onFocusHandler() {
    this.onFocusActive.emit(this.currency.name);
    this.showRelation = true;
  }

  public onBlurHandler() {
    this.showRelation = false;
  }

  public computeCash(): number {
    let computeResult = this.isActive()
                      ? this.currency.cash - this.form.get(this.name).value
                      : this.currency.cash + this.form.get(this.name).value;

    if (computeResult < 0) {
      computeResult = 0;
      this.isComputeResultNegative = true;
    } else {
      this.isComputeResultNegative = false;
    }

    return computeResult;
  }
}
