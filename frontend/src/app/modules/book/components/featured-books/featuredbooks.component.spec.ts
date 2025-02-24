import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedbooksComponent } from './featuredbooks.component';

describe('FeaturedbooksComponent', () => {
  let component: FeaturedbooksComponent;
  let fixture: ComponentFixture<FeaturedbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedbooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
