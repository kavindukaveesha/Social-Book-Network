// book-categories.component.ts
import {Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Category {
  id: string;
  title: string;
  bookCount: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  buttonClass: string;
  tags: string[];
}

@Component({
  selector: 'app-book-categories',
  templateUrl: './books-categories-section.component.html',
  styleUrls: ['./books-categories-section.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None  // Add this if you want styles to affect child components
})
export class BooksCategoriesSectionComponent {
  categories: Category[] = [
    {
      id: 'fiction',
      title: 'Fiction',
      bookCount: 1234,
      icon: 'bi-book',
      iconBg: 'bg-primary bg-opacity-10',
      iconColor: 'text-primary',
      buttonClass: 'btn-outline-primary',
      tags: ['Fantasy', 'Mystery', 'Romance', 'Thriller']
    },
    {
      id: 'non-fiction',
      title: 'Non-Fiction',
      bookCount: 987,
      icon: 'bi-lightbulb',
      iconBg: 'bg-success bg-opacity-10',
      iconColor: 'text-success',
      buttonClass: 'btn-outline-success',
      tags: ['Self-Help', 'Business', 'Science', 'History']
    },
    {
      id: 'children',
      title: 'Children\'s',
      bookCount: 567,
      icon: 'bi-stars',
      iconBg: 'bg-warning bg-opacity-10',
      iconColor: 'text-warning',
      buttonClass: 'btn-outline-warning',
      tags: ['Picture Books', 'Early Readers', 'Middle Grade']
    },
    {
      id: 'academic',
      title: 'Academic',
      bookCount: 789,
      icon: 'bi-mortarboard',
      iconBg: 'bg-info bg-opacity-10',
      iconColor: 'text-info',
      buttonClass: 'btn-outline-info',
      tags: ['Textbooks', 'Reference', 'Research']
    },
    {
      id: 'comics',
      title: 'Comics & Manga',
      bookCount: 456,
      icon: 'bi-images',
      iconBg: 'bg-danger bg-opacity-10',
      iconColor: 'text-danger',
      buttonClass: 'btn-outline-danger',
      tags: ['Graphic Novels', 'Manga', 'Comics']
    },
    {
      id: 'audiobooks',
      title: 'Audiobooks',
      bookCount: 345,
      icon: 'bi-headphones',
      iconBg: 'bg-purple bg-opacity-10',
      iconColor: 'text-purple',
      buttonClass: 'btn-outline-purple',
      tags: ['Fiction', 'Non-Fiction', 'Drama']
    }
  ];

  constructor(private router: Router) {}

  // Handle category exploration
  exploreCategory(categoryId: string): void {
    this.router.navigate(['/books/category', categoryId]);
  }

  // Handle tag click
  onTagClick(tag: string, categoryId: string): void {
    this.router.navigate(['/books/search'], {
      queryParams: { tag: tag, category: categoryId }
    });
  }

  // Format book count for display
  getFormattedBookCount(count: number): string {
    return count > 999 ? `${(count/1000).toFixed(1)}K` : count.toString();
  }
}
