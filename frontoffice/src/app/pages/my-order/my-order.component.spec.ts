import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrderComponent } from './my-order.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MyOrdersComponent', () => {
  let component: MyOrderComponent;
  let fixture: ComponentFixture<MyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrderComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os pedidos (mock)', () => {
    // Isto é apenas estrutural. Para teste real, usa HttpTestingController
    expect(component.loading).toBeFalse();
    expect(Array.isArray(component.orders)).toBeTrue();
  });
});
