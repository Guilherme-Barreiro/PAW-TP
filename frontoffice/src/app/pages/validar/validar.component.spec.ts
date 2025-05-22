import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarComponent } from './validar.component';

describe('ValidarComponent', () => {
  let component: ValidarComponent;
  let fixture: ComponentFixture<ValidarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
