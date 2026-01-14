import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book'; 
import { RouterLink, RouterModule } from '@angular/router';
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

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // 1. S'ABONNER AU FLUX DU SERVICE
    // C'est ce bloc qui permet de mettre à jour la liste quand on cherche un titre
    this.bookService.currentBooks.subscribe((books) => {
      this.booksList = books; 
    });

    // 1b. Suivre la liste des favoris
    this.bookService.currentFavorites.subscribe((favs) => {
      this.favorites = favs || [];
    });

    // 2. CHARGEMENT INITIAL (Livres d'informatique)
    // On appelle l'API, et on envoie le résultat au service via updateBooksList
    this.bookService.getBooks().subscribe((data) => {
      this.bookService.updateBooksList(data.works); 
      console.log('Livres d’informatique chargés au démarrage');
    });
  }

  isFavorite(book: any): boolean {
    if (!book || !book.key) return false;
    return this.bookService.isFavorite(book.key);
  }

  toggleFavorite(book: any) {
    this.bookService.toggleFavorite(book);
  }
}