import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SugestiiLiceuComponent } from './sugestii-liceu.component';

describe('SugestiiLiceuComponent', () => {
	let component: SugestiiLiceuComponent;
	let fixture: ComponentFixture<SugestiiLiceuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SugestiiLiceuComponent],
		}).compileComponents();
		fixture = TestBed.createComponent(SugestiiLiceuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
