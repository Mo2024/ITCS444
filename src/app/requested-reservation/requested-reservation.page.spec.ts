import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestedReservationPage } from './requested-reservation.page';

describe('RequestedReservationPage', () => {
  let component: RequestedReservationPage;
  let fixture: ComponentFixture<RequestedReservationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestedReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
