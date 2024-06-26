import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';

import { CardInputValidatorDirective } from '../../shared/directives/card-input-validator.directive';
import { Country } from '../../shared/enum/country';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTypeaheadModule,
    CardInputValidatorDirective
  ],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCardComponent {
  @Input() form!: FormGroup;

  countries: string[] = Object.values(Country);

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.countries.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);
}
