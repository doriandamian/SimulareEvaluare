import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticiEnComponent } from './statistici-en.component';

describe('StatisticiEnComponent', () => {
  let component: StatisticiEnComponent;
  let fixture: ComponentFixture<StatisticiEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticiEnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticiEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
