import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit {
  @Input() value: string;
  @Input() suffix: string;
  @Input() small: boolean = false;
  @Input() forceDecimal: boolean = false;

  integer: string;
  decimal: string;

  constructor() { }

  ngOnInit() {
    this.value = parseFloat(this.value).toFixed(1);
    [this.integer, this.decimal] = this.value.split('.');
    this.decimal = (this.decimal || [])[0];
    if (this.decimal === '0' && !this.forceDecimal) {
      this.decimal = '';
    }
  }

}
