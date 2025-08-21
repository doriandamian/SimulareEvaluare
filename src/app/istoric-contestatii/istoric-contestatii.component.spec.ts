
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IstoricContestatiiComponent } from './istoric-contestatii.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


const mockCounties = ['AB', 'AR'];
const mockCountyNames = { AB: 'Alba', AR: 'Arad' };

describe('IstoricContestatiiComponent', () => {
  let component: IstoricContestatiiComponent;
  let fixture: ComponentFixture<IstoricContestatiiComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IstoricContestatiiComponent, FormsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IstoricContestatiiComponent);
    component = fixture.componentInstance;
    component.counties = mockCounties;
    component.countyNames = mockCountyNames;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Analiza contestatii la romana');
  });

  it('should call goBack when back button is clicked', () => {
    spyOn(component, 'goBack');
    const button = fixture.nativeElement.querySelector('.back-button');
    button.click();
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should call onCountyChange when county is changed', () => {
    spyOn(component, 'onCountyChange');
    const select = fixture.nativeElement.querySelector('#countySelect');
    select.dispatchEvent(new Event('change'));
    expect(component.onCountyChange).toHaveBeenCalled();
  });

  it('should switch graphs when label is clicked', () => {
    const noteLabel = fixture.nativeElement.querySelector('.graph-switch label:first-child');
    const devLabel = fixture.nativeElement.querySelector('.graph-switch label:last-child');
    noteLabel.click();
    expect(component.selectedGraph).toBe('note');
    devLabel.click();
    expect(component.selectedGraph).toBe('deviatie');
  });
});
