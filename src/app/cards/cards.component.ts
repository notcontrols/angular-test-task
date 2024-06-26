import { Observable, map, takeWhile } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BehaviorSubject, Subscription, takeUntil, timer } from 'rxjs';

import { FormCardComponent } from "./form-card/form-card.component";

import { CardsService } from '../services/cards.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormCardComponent
  ]
})
export class CardsComponent implements OnInit {
  forms: FormGroup[] = [];
  forms$ = new BehaviorSubject<FormGroup[]>(this.forms);

  isSubmitting$ = new BehaviorSubject<boolean>(false);

  timerValue: number = 10; // Set timer duration in seconds
  timeRemaining$!: Observable<number>;
  private submitInterval$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cards: CardsService,
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    this.addForm(); // Initialize with one form
  }

  addForm() {
    if (this.forms.length < 10) {
      const newForm = this.fb.group({
        country: [''],
        username: [''],
        birthday: ['']
      });
      this.forms.push(newForm);
      this.forms$.next(this.forms);
    }
  }

  toggleSubmit() {
    if (this.isSubmitting$.value) {
      this.cancelSubmit();
    } else {
      this.startSubmit();
    }
  }

  startSubmit() {
    // Validate all forms
    let allValid = true;
    this.forms.forEach(form => {
      if (form.invalid) {
        allValid = false;
        this.checkFormGroup(form);
      }
    });

    if (!allValid) {
      return;
    }

    this.isSubmitting$.next(true);
    this.forms.forEach(form => {
      form.disable();
    });

    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => (this.timerValue - n) * 1000),
      takeWhile(n => n >= 0)
    );

    this.submitInterval$ = this.timeRemaining$.subscribe((value) => {
      if (value === 0) {
        this.completeSubmit();
      }
    });
  }

  cancelSubmit() {
    this.submitInterval$.unsubscribe();
    this.isSubmitting$.next(false);
    this.forms.forEach(form => {
      form.enable();
    });
  }

  completeSubmit() {
    const formData = this.forms.map(form => form.value);
    console.log('Forms submitted:', formData);
    this.cards.saveCards(formData).subscribe(response => {
      console.log(response);
      this.resetForms();
    });
  }

  resetForms() {
    this.forms.forEach(form => {
      form.reset();
      form.enable();
    });
    this.isSubmitting$.next(false);
    this.timerValue = 0;
  }

  checkFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.controls[key].markAsTouched();
      formGroup.controls[key].updateValueAndValidity();
    });

    const invalidControl = this.el.nativeElement.querySelector('.is-invalid');

    if (invalidControl) {
      invalidControl.focus();
    }
  }
}
