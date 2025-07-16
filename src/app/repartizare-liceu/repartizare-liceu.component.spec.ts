import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartizareLiceuComponent } from './repartizare-liceu.component';

describe('RepartizareLiceuComponent', () => {
  let component: RepartizareLiceuComponent;
  let fixture: ComponentFixture<RepartizareLiceuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartizareLiceuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepartizareLiceuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
