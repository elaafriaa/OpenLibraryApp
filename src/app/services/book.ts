import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private subjectsUrl = 'https://openlibrary.org/subjects/computers.json';
  private detailsUrl = 'https://openlibrary.org/works/';
  private searchUrl = 'https://openlibrary.org/search.json';

  // Observable state: books list and favorites (persisted)
  private booksSource = new BehaviorSubject<any[]>([]);
  private favSource = new BehaviorSubject<any[]>(this.loadFavorites());
  currentFavorites = this.favSource.asObservable();
  currentBooks = this.booksSource.asObservable();

  constructor(private http: HttpClient) { }

  private loadFavorites(): any[] {
    try {
      const raw = localStorage.getItem('ol_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private saveFavorites(list: any[]) {
    try { localStorage.setItem('ol_favorites', JSON.stringify(list)); } catch (e) { /* ignore storage errors */ }
    this.favSource.next(list);
  }

  // Favorites helpers
  getFavorites(): any[] { return this.favSource.getValue(); }
  isFavorite(key: string): boolean { return this.getFavorites().some((b: any) => b && b.key === key); }
  addFavorite(book: any) {
    const list = this.getFavorites().slice();
    if (!list.some((b: any) => b.key === book.key)) {
      list.unshift(book);
      this.saveFavorites(list);
    }
  }

  removeFavorite(key: string) {
    const list = this.getFavorites().filter((b: any) => b.key !== key);
    this.saveFavorites(list);
  }

  toggleFavorite(book: any) {
    if (!book || !book.key) return;
    if (this.isFavorite(book.key)) {
      this.removeFavorite(book.key);
    } else {
      this.addFavorite(book);
    }
  }

  // Update observable books list
  updateBooksList(books: any[]) { this.booksSource.next(books); }

  // API calls
  getBooks(): Observable<any> { return this.http.get<any>(this.subjectsUrl); }
  getBookById(id: string): Observable<any> { return this.http.get<any>(`${this.detailsUrl}${id}.json`); }
  searchByTitle(title: string): Observable<any> { return this.http.get<any>(`${this.searchUrl}?title=${encodeURIComponent(title)}`); }
  searchByAuthor(author: string): Observable<any> { return this.http.get<any>(`${this.searchUrl}?author=${encodeURIComponent(author)}`); }
  searchBySubject(subject: string): Observable<any> { return this.http.get<any>(`${this.searchUrl}?subject=${encodeURIComponent(subject)}`); }
  // Year search using query syntax
  searchByYear(year: string): Observable<any> { return this.http.get<any>(`${this.searchUrl}?q=first_publish_year:${encodeURIComponent(year)}`); } 
}