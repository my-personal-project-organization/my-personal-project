import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    // Arrange
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default input values', () => {
    it('should default confirmButtonText to "Confirm"', () => {
      expect(component.confirmButtonText()).toBe('Confirm');
    });

    it('should default cancelButtonText to "Cancel"', () => {
      expect(component.cancelButtonText()).toBe('Cancel');
    });

    it('should default isOpen to true', () => {
      expect(component.isOpen()).toBe(true);
    });

    it('should default cancelButtonDisabled to false', () => {
      expect(component.cancelButtonDisabled()).toBe(false);
    });

    it('should default hideCancelButton to false', () => {
      expect(component.hideCancelButton()).toBe(false);
    });

    it('should default confirmButtonDisabled to false', () => {
      expect(component.confirmButtonDisabled()).toBe(false);
    });
  });

  describe('visibility (isOpen)', () => {
    it('should render the dialog content when isOpen is true', () => {
      // Arrange
      fixture.componentRef.setInput('isOpen', true);
      // Act
      fixture.detectChanges();
      // Assert
      const overlay = fixture.debugElement.query(By.css('div'));
      expect(overlay).toBeTruthy();
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(2);
    });

    it('should not render the dialog content when isOpen is false', () => {
      // Arrange
      fixture.componentRef.setInput('isOpen', false);
      // Act
      fixture.detectChanges();
      // Assert
      const overlay = fixture.debugElement.query(By.css('div'));
      expect(overlay).toBeNull();
    });
  });

  describe('title', () => {
    it('should render the provided title', () => {
      // Arrange
      fixture.componentRef.setInput('title', 'My Dialog Title');
      // Act
      fixture.detectChanges();
      // Assert
      const heading = fixture.debugElement.query(By.css('h2'));
      expect(heading.nativeElement.textContent).toContain('My Dialog Title');
    });
  });

  describe('confirm output', () => {
    it('should emit confirm when the confirm button is clicked', () => {
      // Arrange
      const emitSpy = jest.spyOn(component.confirm, 'emit');
      fixture.detectChanges();
      const confirmButton = fixture.debugElement.queryAll(By.css('button'))[0];
      // Act
      confirmButton.nativeElement.click();
      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('closed output', () => {
    it('should emit closed when the cancel button is clicked', () => {
      // Arrange
      const emitSpy = jest.spyOn(component.closed, 'emit');
      fixture.detectChanges();
      const cancelButton = fixture.debugElement.queryAll(By.css('button'))[1];
      // Act
      cancelButton.nativeElement.click();
      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel button', () => {
    it('should hide the cancel button when hideCancelButton is true', () => {
      // Arrange
      fixture.componentRef.setInput('hideCancelButton', true);
      // Act
      fixture.detectChanges();
      // Assert
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(1);
    });

    it('should disable the cancel button when cancelButtonDisabled is true', () => {
      // Arrange
      fixture.componentRef.setInput('cancelButtonDisabled', true);
      // Act
      fixture.detectChanges();
      // Assert
      const cancelButton = fixture.debugElement.queryAll(By.css('button'))[1];
      expect(cancelButton.nativeElement.disabled).toBe(true);
    });
  });

  describe('confirm button', () => {
    it('should disable the confirm button when confirmButtonDisabled is true', () => {
      // Arrange
      fixture.componentRef.setInput('confirmButtonDisabled', true);
      // Act
      fixture.detectChanges();
      // Assert
      const confirmButton = fixture.debugElement.queryAll(By.css('button'))[0];
      expect(confirmButton.nativeElement.disabled).toBe(true);
    });

    it('should render the provided confirmButtonText', () => {
      // Arrange
      fixture.componentRef.setInput('confirmButtonText', 'Save');
      // Act
      fixture.detectChanges();
      // Assert
      const confirmButton = fixture.debugElement.queryAll(By.css('button'))[0];
      expect(confirmButton.nativeElement.textContent).toContain('Save');
    });
  });
});
