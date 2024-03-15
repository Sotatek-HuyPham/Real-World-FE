import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Post } from "../data-access/post.service";

@Component({
selector:'app-post-list-item',
standalone: true,
template:`
    <div style="display: flex; padding: 5px;">
        <a style="padding: 5px;" routerLink="/posts/{{post.id}}">{{post.title}}</a>
        <button routerLink="/posts/update/{{post.id}}">Edit</button>
        <button (click)="delete.emit(post.id)">Delete</button>
    </div>
`,
imports:[RouterLink]
})

export class PostListItemComponent{
    @Input({required: true}) post!:Post;
    @Output() delete = new EventEmitter<number>()
}