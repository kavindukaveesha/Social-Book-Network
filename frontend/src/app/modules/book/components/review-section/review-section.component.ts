// user-reviews.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Review {
  id: number;
  username: string;
  email: string;
  rating: number;
  comment: string;
  date: Date;
  likes: number;
  isLiked: boolean;
}

@Component({
  selector: 'app-user-reviews',
  templateUrl: './review-section.component.html',
  styleUrls: ['./review-section.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('slideInOut', [
      state('true', style({
        height: '*',
        opacity: 1
      })),
      state('false', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
})
export class ReviewSectionComponent {
  reviewForm!: FormGroup;
  showReviewForm = false;
  rating = 0;
  hoveredRating = 0;
  loadingMore = false;
  hasMoreReviews = true;
  currentPage = 1;

  reviews: Review[] = [
    {
      id: 1,
      username: 'Sarah Johnson',
      email: 'sarah@example.com',
      rating: 5,
      comment: 'Amazing selection of books! The recommendations are always spot-on, and the reading experience is fantastic.',
      date: new Date('2024-02-20'),
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      username: 'Michael Chen',
      email: 'michael@example.com',
      rating: 4,
      comment: 'Great platform for book lovers. The user interface is intuitive and the community is very engaging.',
      date: new Date('2024-02-19'),
      likes: 8,
      isLiked: true
    },
    {
      id: 3,
      username: 'Emma Davis',
      email: 'emma@example.com',
      rating: 5,
      comment: 'Love the variety of genres available. The personalized recommendations have helped me discover so many great books!',
      date: new Date('2024-02-18'),
      likes: 15,
      isLiked: false
    }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  private initForm(): void {
    this.reviewForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      comment: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.rating = 0;
    this.hoveredRating = 0;
  }

  setRating(value: number): void {
    this.rating = value;
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.rating > 0) {
      const newReview: Review = {
        id: this.generateReviewId(),
        username: this.reviewForm.value.username,
        email: this.reviewForm.value.email,
        rating: this.rating,
        comment: this.reviewForm.value.comment,
        date: new Date(),
        likes: 0,
        isLiked: false
      };

      // Add to beginning of array
      this.reviews.unshift(newReview);

      // Close form and reset
      this.toggleReviewForm();
      this.resetForm();

      // Scroll new review into view
      setTimeout(() => {
        document.getElementById(`review-${newReview.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }

  likeReview(reviewId: number): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) {
      review.isLiked = !review.isLiked;
      review.likes += review.isLiked ? 1 : -1;

      // Animate like button
      const likeBtn = document.querySelector(`#like-${reviewId}`);
      if (likeBtn) {
        likeBtn.classList.add('liked-animation');
        setTimeout(() => likeBtn.classList.remove('liked-animation'), 300);
      }
    }
  }

  loadMoreReviews(): void {
    this.loadingMore = true;

    // Simulate API call
    setTimeout(() => {
      const moreReviews: Review[] = [
        {
          id: this.generateReviewId(),
          username: 'Alex Thompson',
          email: 'alex@example.com',
          rating: 4,
          comment: 'Very satisfied with the service. The book recommendations are excellent and the community discussions are enlightening.',
          date: new Date('2024-02-17'),
          likes: 6,
          isLiked: false
        },
        {
          id: this.generateReviewId(),
          username: 'Lisa Wang',
          email: 'lisa@example.com',
          rating: 5,
          comment: 'Exceptional platform for book enthusiasts. The community features are outstanding and I love the personalized reading lists!',
          date: new Date('2024-02-16'),
          likes: 10,
          isLiked: false
        }
      ];

      this.reviews = [...this.reviews, ...moreReviews];
      this.currentPage++;
      this.loadingMore = false;

      // Disable load more after certain pages
      if (this.currentPage >= 3) {
        this.hasMoreReviews = false;
      }
    }, 1000);
  }

  private generateReviewId(): number {
    return Math.max(...this.reviews.map(r => r.id), 0) + 1;
  }

  // Getters for form validation
  get usernameErrors() {
    const control = this.reviewForm.get('username');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Username is required';
      if (control.errors['minlength']) return 'Username must be at least 2 characters';
      if (control.errors['maxlength']) return 'Username must be less than 50 characters';
    }
    return null;
  }

  get emailErrors() {
    const control = this.reviewForm.get('email');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['maxlength']) return 'Email must be less than 100 characters';
    }
    return null;
  }

  get commentErrors() {
    const control = this.reviewForm.get('comment');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Review comment is required';
      if (control.errors['minlength']) return 'Comment must be at least 10 characters';
      if (control.errors['maxlength']) return 'Comment must be less than 500 characters';
    }
    return null;
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
