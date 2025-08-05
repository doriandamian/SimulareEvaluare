import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimulAdmisComponent } from './ultimul-admis.component';

describe('UltimulAdmisComponent', () => {
  let component: UltimulAdmisComponent;
  let fixture: ComponentFixture<UltimulAdmisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimulAdmisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimulAdmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
