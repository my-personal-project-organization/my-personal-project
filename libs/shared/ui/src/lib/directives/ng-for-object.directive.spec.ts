/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForObjectDirective } from './ng-for-object.directive';

@Component({
  standalone: true,
  imports: [NgForObjectDirective],
  template: `
    <ng-container *uiNgForObject="let item; from: myObject; let index = index">
      <div id="item-{{ i }}">{{ item }}</div>
    </ng-container>
  `,
})
class TestHostComponent {
  myObject: { [key: string]: unknown } = {};
}

describe('NgForObjectDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should iterate over a simple object', () => {
    component.myObject = { a: 1, b: 2, c: 3 };
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(3);
    expect(divs[0].textContent).toContain('1');
    expect(divs[1].textContent).toContain('2');
    expect(divs[2].textContent).toContain('3');
  });

  it('should handle an empty object', () => {
    component.myObject = {};
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should handle a null object', () => {
    component.myObject = null as any; //type assertion to handle null
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should handle an undefined object', () => {
    component.myObject = undefined as any; //type assertion to handle undefined
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should handle an object with mixed data types', () => {
    component.myObject = { a: 1, b: 'hello', c: true, d: { e: 1 } };
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(4);
  });

  it('should update the view when the input changes', () => {
    component.myObject = { a: 1, b: 2 };
    fixture.detectChanges();
    let divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(2);
    component.myObject = { a: 1, b: 2, c: 3 };
    fixture.detectChanges();
    divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(3);
  });
});
