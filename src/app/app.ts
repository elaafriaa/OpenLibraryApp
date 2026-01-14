import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// On n'importe plus BookList ici car il est géré par les routes
import { SearchBar } from './components/search-bar/search-bar';
import { HeadBar } from './components/head-bar/head-bar';

@Component({
  selector: 'app-root',
  standalone: true, // Assure-toi que c'est bien présent
  imports: [RouterOutlet, SearchBar, HeadBar], // On a enlevé BookList
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('open-library-app');
}