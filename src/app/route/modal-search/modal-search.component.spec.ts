import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchComponent } from './modal-search.component';

describe('ModalSearchComponent', () => {
  let component: ModalSearchComponent;
  let fixture: ComponentFixture<ModalSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchComponent]
    });
    fixture = TestBed.createComponent(ModalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
