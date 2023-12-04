import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateHallPage } from './create-hall.page';

describe('CreateHallPage', () => {
  let component: CreateHallPage;
  let fixture: ComponentFixture<CreateHallPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateHallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
