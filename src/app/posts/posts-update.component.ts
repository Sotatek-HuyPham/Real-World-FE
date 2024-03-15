import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { CreatePost, PostService } from './data-access/post.service';

@Component({
  selector: 'update-post',
  standalone: true,
  template: `
    @switch (postQ.status()) { @case ('pending') { Loading............. }
    @case('error') { Error!!!!!!! }  @default {
    <form [formGroup]="updateForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <div>
        <input type="text" formControlName="title" />
        <input type="text" formControlName="content" />
      </div>
      <button>Update</button>
    </form>
    } }
  `,
  imports: [ReactiveFormsModule],
})
export default class UpdatePostComponent {
  @Input() postId: string = '';
  #postService = inject(PostService);
  #queryClient = injectQueryClient();
  #router = inject(Router);
  #fb = inject(FormBuilder);
  updateForm = this.#fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    content: [''],
  });

  postQ = injectQuery(() => ({
    queryKey: ['PostService', 'getPostById', this.postId],
    queryFn: () =>
      lastValueFrom(this.#postService.getPostById(String(this.postId))).then(
        (data) => {
          this.updateForm.patchValue({
            title: data.title,
            content: data.content,
          });
          return data;
        }
      ),
  }));

  updatePostMutation = injectMutation(() => ({
    mutationFn: (payload: { id: string; data: CreatePost }) =>
      lastValueFrom(this.#postService.updatePost(payload)),
  }));

  onSubmit() {
    if (this.updateForm.valid) {
      this.updatePostMutation.mutate(
        {
          id: this.postId,
          data: {
            title: this.updateForm.value.title ?? '',
            content: this.updateForm.value.content ?? '',
          },
        },
        {
          onSuccess: async () => {
            this.#queryClient.removeQueries({ queryKey: ['PostService'] });
            this.#router.navigate(['/posts']);
          },
        }
      );
    }
  }
}
