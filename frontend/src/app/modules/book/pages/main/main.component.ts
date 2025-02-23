import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userName: string | null = 'John Doe'; // Replace with actual login logic or service
  mostTakenBooks = [
    { id: 1, title: 'The Great Gatsby', cover: 'assets/books/book1.jpg', borrowCount: 150 },
    { id: 2, title: '1984', cover: 'assets/books/book2.jpg', borrowCount: 120 },
    { id: 3, title: 'To Kill a Mockingbird', cover: 'assets/books/book3.jpg', borrowCount: 100 }
  ];
  featuredBooks = [
    { id: 1, title: 'The Great Gatsby', cover: 'assets/books/book4.jpg', author: 'F. Scott Fitzgerald' },
    { id: 2, title: '1984', cover: 'assets/books/book5.jpg', author: 'George Orwell' },
    { id: 3, title: 'To Kill a Mockingbird', cover: 'assets/books/book6.jpg', author: 'Harper Lee' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    console.log('Most Taken Books:', this.mostTakenBooks);
    console.log('Featured Books:', this.featuredBooks);

    // Check if running in browser before accessing DOM
    if (isPlatformBrowser(this.platformId)) {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const bookSlider = document.querySelector('.book-slider');

      if (prevBtn && nextBtn && bookSlider) {
        prevBtn.addEventListener('click', () => {
          bookSlider.scrollLeft -= 300;
        });
        nextBtn.addEventListener('click', () => {
          bookSlider.scrollLeft += 300;
        });
      }
    }
  }
}
