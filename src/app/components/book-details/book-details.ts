import { Component , OnInit} from '@angular/core';
import { ActivatedRoute , Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css'],
})
export class BookDetails implements OnInit {
  book: any;
  fav = false;
  showFullDescription = false;
  descriptionText = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Récupérer l'ID de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // 2. Appeler le service
      this.bookService.getBookById(id).subscribe(data => {
        this.book = data;
        // Normaliser la description
        const desc = this.book?.description;
        this.descriptionText = desc ? (desc.value || desc) : '';
        this.showFullDescription = false;

        this.fav = this.bookService.isFavorite(this.book.key);
        // mettre à jour si la liste des favoris change
        this.bookService.currentFavorites.subscribe(() => {
          this.fav = this.bookService.isFavorite(this.book.key);
        });
      });
    }
  }

  get shortDescription(): string {
    if (!this.descriptionText) return 'Aucune description disponible pour ce livre.';
    return this.descriptionText.length > 350 ? this.descriptionText.slice(0,350) + '...' : this.descriptionText;
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  onSubjectClick(subject: any) {
    const sub = subject ? String(subject) : '';
    if (!sub) return;
    this.bookService.searchBySubject(sub).subscribe((data: any) => {
      this.bookService.updateBooksList(data.docs || []);
      this.router.navigate(['/']);
    });
  }

  toggleFavorite() {
    if (!this.book) return;
    this.bookService.toggleFavorite(this.book);
  }
} 
