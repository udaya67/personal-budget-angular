// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private budgetData: any[] = []; // Store the budget data here

  constructor(private http: HttpClient) {}

  // Method to fetch the budget data from the backend if it's not already loaded
  fetchBudgetData(): Observable<any> {
    if (this.budgetData.length > 0) {
      // If the data is already available, return it as an observable
      return new Observable(observer => {
        observer.next({ myBudget: this.budgetData });
        observer.complete();
      });
    } else {
      // Make the HTTP call to fetch data from the backend
      return this.http.get('http://localhost:3000/budget');
    }
  }

  // Method to set the budget data
  setfetchBudgetData(data: any) {
    this.budgetData = data;
  }
}
