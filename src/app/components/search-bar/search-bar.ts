import { Component } from '@angular/core';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-search-bar',
  imports: [],
  standalone: true,
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {

  constructor(private bookService: BookService) { }

  // field: 'title' | 'author'
  onSearch(field: string, query: string | null, year: string | null) {
    const q = (query || '').trim();
    const y = (year || '').trim();

    if (!q && !y) return; // nothing to search

    // If there's a textual query, prefer searching by chosen field
    if (q) {
      if (field === 'author') {
        this.bookService.searchByAuthor(q).subscribe((data) => {
          this.bookService.updateBooksList(data.docs || []);
        });
      } else {
        // default: title
        this.bookService.searchByTitle(q).subscribe((data) => {
          let docs = data.docs || [];
          // If year is provided, filter client-side for better precision
          if (y) {
            docs = docs.filter((d: any) => d.first_publish_year && d.first_publish_year.toString() === y);
          }
          this.bookService.updateBooksList(docs);
        });
      }
      return;
    }

    // If only year provided
    if (y) {
      this.bookService.searchByYear(y).subscribe((data) => {
        this.bookService.updateBooksList(data.docs || []);
      });
    }
  }

  clear(queryRef?: HTMLInputElement, yearRef?: HTMLInputElement) {
    if (queryRef) queryRef.value = '';
    if (yearRef) yearRef.value = '';
    // restore default list
    this.bookService.getBooks().subscribe((data) => {
      this.bookService.updateBooksList(data.works || []);
    });
  }

  // Legacy helpers (kept for backward compatibility with templates/tests)
  onSearchTitle(title: string) { this.onSearch('title', title, null); }
  onSearchYear(year: string) { this.onSearch('title', null, year); }
} 