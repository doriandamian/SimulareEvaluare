import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepartizareFormComponent } from './repartizare-form.component';
import { FormsModule } from '@angular/forms';

describe('RepartizareFormComponent', () => {
	let component: RepartizareFormComponent;
	let fixture: ComponentFixture<RepartizareFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RepartizareFormComponent, FormsModule],
		}).compileComponents();
		fixture = TestBed.createComponent(RepartizareFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should emit search event with correct values on submit', () => {
		spyOn(component.search, 'emit');
		component.selectedYear = 2023;
		component.medieAdmitere = '8.75';
		component.medieAbsolvire = '7.50';
		component.onSubmit();
		expect(component.search.emit).toHaveBeenCalledWith({ year: 2023, madm: 8.75, mabs: 7.5 });
	});

	it('should emit search event with undefined mabs if medieAbsolvire is not a number', () => {
		spyOn(component.search, 'emit');
		component.selectedYear = 2022;
		component.medieAdmitere = '9.00';
		component.medieAbsolvire = '';
		component.onSubmit();
		expect(component.search.emit).toHaveBeenCalledWith({ year: 2022, madm: 9.0, mabs: undefined });
	});
});
