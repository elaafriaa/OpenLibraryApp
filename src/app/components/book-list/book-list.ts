import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book'; 
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css'],
})
export class BookList implements OnInit {

  booksList: any[] = [];
  favorites: any[] = [];

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to observable lists
    this.bookService.currentBooks.subscribe((books) => { this.booksList = books; });
    this.bookService.currentFavorites.subscribe((favs) => { this.favorites = favs || []; });

    // Initial load: popular books
    this.bookService.getBooks().subscribe((data) => { this.bookService.updateBooksList(data.works); });
  }

  isFavorite(book: any): boolean {
    if (!book || !book.key) return false;
    return this.bookService.isFavorite(book.key);
  }

  toggleFavorite(book: any) {
    this.bookService.toggleFavorite(book);
  }

  openDetails(book: any) {
    if (!book || !book.key) return;
    const id = book.key.split('/')[2];
    this.router.navigate(['/book', id]);
  }
} 