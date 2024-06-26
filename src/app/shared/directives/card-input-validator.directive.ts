import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ValidationErrors, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

import { BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Country } from '../enum/country';
import { CardsService } from '../../services/cards.service';

@Directive({
  selector: '[cardInputValidator]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: CardInputValidatorDirective, multi: true }]
})
export class CardInputValidatorDirective implements Validator {
  @Input('cardInputValidator') inputType!: string;
  countries: string[] = Object.values(Country);

  private usernameSubject = new Subject<string>();
  private usernameAvailable$ = new BehaviorSubject<boolean>(true);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cards: CardsService
  ) {
    this.usernameSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(username => username ? this.cards.usernameCheck(username) : of(true))
    ).subscribe(isAvailable => {
      this.usernameAvailable$.next(isAvailable);
      this.updateValidity(isAvailable, 'Please provide a correct Username');
    });
  }


  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (this.inputType === 'username') {
      this.usernameSubject.next(value);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {

    if (this.inputType === 'birthday') {
      return this.validateBirthday(control);
    } else if (this.inputType === 'country') {
      return this.validateCountry(control);
    } else if (this.inputType === 'username') {
      return this.usernameAvailable$.value ? null : { invalidUsername: true };
    }

    return null;
  }

  private validateCountry(control: AbstractControl): ValidationErrors | null {
    const valid = this.countries.includes(control.value);
    if (!control.value || valid) {
      this.updateValidity(true, '');
      return null;
    } else {
      this.updateValidity(false, 'Please provide a correct Country');
      return { invalidCountry: true };
    }

  }

  private validateBirthday(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate > today) {
      this.updateValidity(false, 'Please provide a correct Birthday');
      return { invalidDate: true };
    } else {
      this.updateValidity(true, '');
      return null;
    }
  }

  private updateValidity(isValid: boolean, errorMessage: string) {
    if (!isValid) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
      this.setErrorMessage(errorMessage);
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
      this.setErrorMessage('');
    }
  }

  private setErrorMessage(message: string) {
    let errorElement = this.el.nativeElement.parentNode.lastChild;
    if (!errorElement || errorElement.className !== 'invalid-feedback') {
      errorElement = this.renderer.createElement('div');
      this.renderer.addClass(errorElement, 'invalid-feedback');
      this.renderer.appendChild(this.el.nativeElement.parentNode, errorElement);
    }
    this.renderer.setProperty(errorElement, 'innerText', message);
  }
}
