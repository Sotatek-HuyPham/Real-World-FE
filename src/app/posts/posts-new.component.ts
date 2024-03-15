import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { CreatePost, PostService } from './data-access/post.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-new-post',
  standalone: true,
  template: `
    <form [formGroup]="postForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <div>
        <input type="text" placeholder="Title" formControlName="title" />
        @if( !postForm.controls.title.valid && (postForm.controls.title.dirty ||
        form.submitted) ){
        <p>Title is required</p>
        }
      </div>
      <div>
        <input type="text" placeholder="Content" formControlName="content" />
      </div>
      <button>Create</button>
      @if(addPostMutation.isPending()){
      <span>Loading..............</span>
      }@else if (addPostMutation.error()) {
      <span>Something went wrong!</span>
      }
    </form>
  `,
  imports: [ReactiveFormsModule],
})
export default class NewPostComponet {
  #queryClient = injectQueryClient();
  #router = inject(Router);
  #postService = inject(PostService);
  #fb = inject(FormBuilder);

  addPostMutation = injectMutation(() => ({
    mutationFn: (data: CreatePost) =>
      lastValueFrom(this.#postService.createPost(data)),
  }));

  postForm = this.#fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    content: [''],
  });

  onSubmit() {
    if (this.postForm.valid) {
      this.addPostMutation.mutate(this.postForm.getRawValue(), {
        onSuccess: async () => {
          this.#queryClient.removeQueries({ queryKey: ['PostService'] });
          this.#router.navigate(['/posts']);
        },
      });
    }
  }
}
