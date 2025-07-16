import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticiBACComponent } from './statistici-bac.component';

describe('StatisticiBACComponent', () => {
  let component: StatisticiBACComponent;
  let fixture: ComponentFixture<StatisticiBACComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticiBACComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticiBACComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
