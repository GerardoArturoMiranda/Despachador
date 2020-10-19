import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DespachadorComponent } from './despachador.component';

describe('DespachadorComponent', () => {
  let component: DespachadorComponent;
  let fixture: ComponentFixture<DespachadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespachadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespachadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
