import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // Ajoute BehaviorSubject ici

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private subjectsUrl = 'https://openlibrary.org/subjects/computers.json';
  private detailsUrl = 'https://openlibrary.org/works/';
  private searchUrl = 'https://openlibrary.org/search.json';

  // --- NOUVEAU : Le canal de communication ---
  // On crée une "source" qui contient la liste des livres (vide au début [])
  private booksSource = new BehaviorSubject<any[]>([]);
  // Favoris persistés localement
  private favSource = new BehaviorSubject<any[]>(this.loadFavorites());
  currentFavorites = this.favSource.asObservable();
  // On crée un "observable" que les composants vont surveiller (écouter)
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
    try {
      localStorage.setItem('ol_favorites', JSON.stringify(list));
    } catch (e) {
      // ignore
    }
    this.favSource.next(list);
  }

  // Favoris API
  getFavorites(): any[] {
    return this.favSource.getValue();
  }

  isFavorite(key: string): boolean {
    return this.getFavorites().some((b: any) => b && b.key === key);
  }

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

  // --- NOUVEAU : La méthode pour diffuser les nouveaux résultats ---
  updateBooksList(books: any[]) {
    this.booksSource.next(books);
  }

  // 1. Liste de tous les livres d'informatique
  getBooks(): Observable<any> {
    return this.http.get<any>(this.subjectsUrl);
  }

  // 2. Chercher un livre par son identifiant
  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${this.detailsUrl}${id}.json`);
  }

  // 3. Recherche par titre
  searchByTitle(title: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?title=${encodeURIComponent(title)}`);
  }

  // 3b. Recherche par auteur
  searchByAuthor(author: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?author=${encodeURIComponent(author)}`);
  }

  // 3c. Recherche par sujet
  searchBySubject(subject: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?subject=${encodeURIComponent(subject)}`);
  }

  // 4. Recherche par année d'édition
  searchByYear(year: string): Observable<any> {
    // Note: Utiliser 'q=' est souvent plus fiable pour l'année sur cette API
    return this.http.get<any>(`${this.searchUrl}?q=first_publish_year:${encodeURIComponent(year)}`);
  } 
}