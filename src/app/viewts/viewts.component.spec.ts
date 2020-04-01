import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtsComponent } from './viewts.component';

describe('ViewtsComponent', () => {
  let component: ViewtsComponent;
  let fixture: ComponentFixture<ViewtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
