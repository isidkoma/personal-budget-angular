import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any[] = []; // Variable to store fetched data
  private dataLoaded = false; // Flag to track if data has been loaded

  constructor(private http: HttpClient) {}

  fetchDataFromBackend(): Observable<any> {
    
    if (this.dataLoaded) {
      return of(this.data);
    }

  
    return this.http.get('http://localhost:3000/budget').pipe(
      tap((response: any) => {
        this.data = response.myBudget;
        this.dataLoaded = true; 
      }),
      catchError((error) => {
        // Handle errors here if needed
        console.error('Error fetching data:', error);
        return of([]); 
      })
    );
  }

  getData(): Observable<any[]> {
    // Check if data is loaded, if not, fetch it first
    if (!this.dataLoaded) {
      return this.fetchDataFromBackend();
    }
    
    return of(this.data);
  }
}
