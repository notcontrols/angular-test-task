import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "./shared/enum/country";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  getRegion(country: Country): Observable<{region: string}> {
    return this.http.post<{region: string}>('/api/regions', {country});
  }

  checkUser(username: string): Observable<{ isAvailable: boolean }> {
    return this.http.post<{ isAvailable: boolean }>('/api/checkUsername', { username });
  }
}
