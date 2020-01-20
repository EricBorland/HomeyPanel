import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit {
  @Input() value: string;
  @Input() suffix: string;
  @Input() small = false;
  @Input() forceDecimal = false;

  integer: string;
  decimal: string;

  ngOnInit(): void {
    this.value = parseFloat(this.value).toFixed(1);
    [this.integer, this.decimal] = this.value.split('.');
    this.decimal = (this.decimal || [])[0];
    if (this.decimal === '0' && !this.forceDecimal) {
      this.decimal = '';
    }
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

}
