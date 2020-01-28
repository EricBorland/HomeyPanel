import {
  AfterContentChecked,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

const NO_SWIPING = -1;
const VERTICAL = 0;
const HORIZONTAL = 1;

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements AfterContentChecked {
  pressing: boolean;
  longPressing: boolean;
  timeout: any;
  interval: number;
  swiping: number = NO_SWIPING;
  elementBoundingClient;

  @Input() verticalPanningClass: string;
  @Input() horizontalPanningClass: string;
  @Output() onLongPress = new EventEmitter();
  @Output() onLongPressing = new EventEmitter();
  @Output() onPress = new EventEmitter();
  @Output() onVerticalPanning = new EventEmitter();
  @Output() onHorizontalPanning = new EventEmitter();
  @Output() onVerticalPanned = new EventEmitter();
  @Output() onHorizontalPanned = new EventEmitter();

  // TODO allow double click / tap as well

  @HostBinding('class.press')
  get press(): boolean {
    return this.pressing;
  }

  @HostBinding('class.longpress')
  get longPress(): boolean {
    return this.longPressing;
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event): void {
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
  @HostListener('drop', ['$event'])
  @HostListener('dragend', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('mousemove', ['$event'])
  endPress(event): void {
    if (this.swiping === NO_SWIPING) {
      clearTimeout(this.timeout);
      clearInterval(this.interval);
      if (this.pressing && !this.longPressing && event.type !== 'mousemove') {
        this.onPress.emit(event);
      }
      this.longPressing = false;
      this.pressing = false;
    }
  }

  constructor(private element: ElementRef) {
    const hammerElement = new Hammer(element.nativeElement);
    hammerElement.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammerElement.on('panup', this.verticalPan.bind(this));
    hammerElement.on('pandown', this.verticalPan.bind(this));
    hammerElement.on('panright', this.horizontalPan.bind(this));
    hammerElement.on('panleft', this.horizontalPan.bind(this));
    hammerElement.on('panend', this.panEnd.bind(this));
  }

  ngAfterContentChecked(): void {
    this.elementBoundingClient = this.element.nativeElement.getBoundingClientRect();
  }

  verticalPan(event): void {
    if (this.horizontalPanningClass && this.horizontalPanningClass === event.srcEvent.target.className) {
      this.horizontalPan(event);
      return;
    }
    if (this.swiping !== HORIZONTAL) {
      this.addElementCoords(event);
      this.swiping = VERTICAL;
      this.onVerticalPanning.emit(event);
    }
  }

  horizontalPan(event): void {
    if (this.swiping !== VERTICAL) {
      this.addElementCoords(event);
      this.swiping = HORIZONTAL;
      this.onHorizontalPanning.emit(event);
    }
  }

  panEnd(event): void {
    this.addElementCoords(event);
    switch (this.swiping) {
    case VERTICAL:
      this.onVerticalPanned.emit(event);
      break;
    case HORIZONTAL:
      this.onHorizontalPanned.emit(event);
      break;
    }
    this.swiping = NO_SWIPING;
  }

  addElementCoords(event): void {
    event.elementCoords = {
      x: event.center.x - this.elementBoundingClient.left,
      y: this.elementBoundingClient.bottom - event.center.y
    };
    event.elementCoords.relativeX = event.elementCoords.x / this.elementBoundingClient.height;
    event.elementCoords.relativeY = event.elementCoords.y / this.elementBoundingClient.height;
  }
}

