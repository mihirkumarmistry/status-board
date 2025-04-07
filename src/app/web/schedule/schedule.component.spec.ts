import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleResp } from '@core/model/schedule.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { of, throwError } from 'rxjs';
import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let apiErrorServiceSpy: jasmine.SpyObj<ApiErrorService>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getSchedule', 'postSchedule', 'deleteSchedule']);
    const errorSpy = jasmine.createSpyObj('ApiErrorService', ['toastMessage']);
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ScheduleComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ApiErrorService, useValue: errorSpy },
        { provide: NgbModal, useValue: modalSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiErrorServiceSpy = TestBed.inject(ApiErrorService) as jasmine.SpyObj<ApiErrorService>;
    modalServiceSpy = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllEvent on init', () => {
    const mockResp = [
      { id: 1, title: 'Meeting', start: new Date().toISOString(), end: new Date().toISOString() }
    ];
    apiServiceSpy.getSchedule.and.returnValue(of(mockResp));

    component.ngOnInit();

    expect(apiServiceSpy.getSchedule).toHaveBeenCalled();
    expect(component.events.length).toBe(1);
    expect(component.calendarOptions.events).toBe(mockResp);
  });

  it('should handle error in getAllEvent()', () => {
    apiServiceSpy.getSchedule.and.returnValue(throwError(() => new Error('Fail')));

    component.getAllEvent();

    expect(apiErrorServiceSpy.toastMessage).toHaveBeenCalledWith('Error', 'Failed to get sechedule', 'Error');
  });

  it('should open modal on date click and filter events', () => {
    const mockEvent = {
      start: new Date().toISOString()
    };
    component.events = [mockEvent];

    const dateStr = new Date().toISOString().split('T')[0];
    component.handleDateClick({ dateStr });

    expect(component.dateEvents.length).toBe(1);
    expect(modalServiceSpy.open).toHaveBeenCalled();
  });

  it('should open edit model onAddEvent', () => {
    component.onAddEvent();
    expect(modalServiceSpy.open).toHaveBeenCalled();
  });

  it('should save event and refresh list on success', () => {
    apiServiceSpy.postSchedule.and.returnValue(of({
      id: 1,
      title: 'Test',
      color: 'green',
      start: new Date(),
      end: new Date()
    } as ScheduleResp));
    spyOn(component, 'getAllEvent');

    component.onSaveEvent();

    expect(apiServiceSpy.postSchedule).toHaveBeenCalled();
    expect(component.getAllEvent).toHaveBeenCalled();
  });

  it('should handle error on event save', () => {
    apiServiceSpy.postSchedule.and.returnValue(throwError(() => new Error('Error')));
    component.onSaveEvent();
    expect(apiErrorServiceSpy.toastMessage).toHaveBeenCalledWith('Error', 'Failed to save schedule.', 'Error');
  });

  it('should delete event and refresh on success', () => {
    apiServiceSpy.deleteSchedule.and.returnValue(of({}));
    spyOn(component, 'getAllEvent');

    component.onDeleteEvent({
      id: 1,
      title: 'Test',
      start: new Date(),
      end: new Date(),
      color: 'green'
    });

    expect(apiServiceSpy.deleteSchedule).toHaveBeenCalledWith(1);
    expect(component.getAllEvent).toHaveBeenCalled();
  });
});
