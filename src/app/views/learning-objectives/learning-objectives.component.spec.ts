import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningObjectivesComponent } from './learning-objectives.component';

describe('LearningObjectivesComponent', () => {
  let component: LearningObjectivesComponent;
  let fixture: ComponentFixture<LearningObjectivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningObjectivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
