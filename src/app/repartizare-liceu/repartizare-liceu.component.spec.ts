
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepartizareLiceuComponent } from './repartizare-liceu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from './services/data.service';
import { of } from 'rxjs';

describe('RepartizareLiceuComponent', () => {
	let component: RepartizareLiceuComponent;
	let fixture: ComponentFixture<RepartizareLiceuComponent>;
	let dataServiceSpy: jasmine.SpyObj<DataService>;

	beforeEach(async () => {
		const spy = jasmine.createSpyObj('DataService', ['getCandidates']);
		await TestBed.configureTestingModule({
			imports: [RepartizareLiceuComponent, HttpClientTestingModule],
			providers: [
				{ provide: DataService, useValue: spy }
			],
		}).compileComponents();
		fixture = TestBed.createComponent(RepartizareLiceuComponent);
		component = fixture.componentInstance;
		dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call history.back when goBack is called', () => {
		spyOn(history, 'back');
		component.goBack();
		expect(history.back).toHaveBeenCalled();
	});

	it('should calculate average correctly', () => {
		expect(component.avg([1, 2, 3])).toBe(2);
		expect(component.avg([2, 4, 6, 8])).toBe(5);
		expect(component.avg([NaN, 2, 4])).toBe(3);
		expect(component.avg([NaN, NaN])).toBeNaN();
	});

	it('should update sugestii and statistici on onSearch', () => {
		const mockCandidates = [
			{ madm: '7.5', nro: '8', nmate: '7', mabs: '7', ja: '', jp: '', n: '', s: '', sc: '', mev: '', lm: '', nlm: '', h: '', sp: '' },
			{ madm: '8.5', nro: '9', nmate: '8', mabs: '8', ja: '', jp: '', n: '', s: '', sc: '', mev: '', lm: '', nlm: '', h: '', sp: '' },
			{ madm: '6.5', nro: '7', nmate: '6', mabs: '6', ja: '', jp: '', n: '', s: '', sc: '', mev: '', lm: '', nlm: '', h: '', sp: '' },
		];
		dataServiceSpy.getCandidates.and.returnValue(of(mockCandidates));
		component.onSearch({ year: 2024, madm: 7.5 });
		// Simulate async
		fixture.detectChanges();
		expect(component.sugestii.length).toBe(2);
		expect(component.sugestii[0].madm).toBe('7.5');
		expect(component.statistici.total).toBe(3);
		expect(component.statistici.madm).toBeCloseTo(7.5, 1);
	});
});

