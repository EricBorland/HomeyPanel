import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTileComponent } from './container-tile.component';

describe('ContainerTileComponent', () => {
  let component: ContainerTileComponent;
  let fixture: ComponentFixture<ContainerTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
