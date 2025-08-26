import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsPanelComponent } from './statistics-panel.component';

describe('StatisticsPanelComponent', () => {
	let component: StatisticsPanelComponent;
	let fixture: ComponentFixture<StatisticsPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StatisticsPanelComponent],
		}).compileComponents();
		fixture = TestBed.createComponent(StatisticsPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should accept year and statistici as input', () => {
		component.year = 2024;
		component.statistici = { test: 1 };
		fixture.detectChanges();
		expect(component.year).toBe(2024);
		expect(component.statistici).toEqual({ test: 1 });
	});
});
