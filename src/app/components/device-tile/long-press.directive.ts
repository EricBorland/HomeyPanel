import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective {
  pressing: boolean;
  longPressing: boolean;
  timeout: any;
  interval: number;

  @Output()
  onLongPress = new EventEmitter();

  @Output()
  onLongPressing = new EventEmitter();

  @Output()
  onPress = new EventEmitter();

  // TODO allow double click / tap as well

  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this.longPressing; }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.pressing = true;
    this.longPressing = false;
    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.interval = setInterval(() => {
        this.onLongPressing.emit(event);
      }, 50);
    }, 500);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('mousemove', ['$event'])
  endPress(event) {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    if (this.pressing && !this.longPressing && event.type !== 'mousemove') {
      this.onPress.emit(event);
    }
    this.longPressing = false;
    this.pressing = false;
  }
}

