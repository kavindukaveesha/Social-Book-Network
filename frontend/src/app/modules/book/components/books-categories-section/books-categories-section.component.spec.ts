import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCategoriesSectionComponent } from './books-categories-section.component';

describe('BooksCategoriesSectionComponent', () => {
  let component: BooksCategoriesSectionComponent;
  let fixture: ComponentFixture<BooksCategoriesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksCategoriesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksCategoriesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
