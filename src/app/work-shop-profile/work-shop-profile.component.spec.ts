import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkShopProfileComponent } from './work-shop-profile.component';

describe('WorkShopProfileComponent', () => {
  let component: WorkShopProfileComponent;
  let fixture: ComponentFixture<WorkShopProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkShopProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkShopProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
