import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTileComponent } from './device-tile.component';

describe('DeviceTileComponent', () => {
  let component: DeviceTileComponent;
  let fixture: ComponentFixture<DeviceTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
