import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @Input() orderId!: string;

    commentText: string = '';
    imageFile: File | null = null;
    comments: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadComments();
    }

    loadComments(): void {
        this.http.get<any[]>(`http://localhost:3000/api/comments/${this.orderId}`).subscribe({
            next: (res) => this.comments = res,
            error: () => console.warn('Erro ao carregar comentários.')
        });
    }

    onFileSelected(event: any): void {
        this.imageFile = event.target.files[0];
    }

    submitComment(): void {
        if (!this.commentText.trim()) return;

        const formData = new FormData();
        formData.append('text', this.commentText);
        if (this.imageFile) formData.append('image', this.imageFile);

        this.http.post(`http://localhost:3000/api/comments/${this.orderId}`, formData).subscribe({
            next: () => {
                this.commentText = '';
                this.imageFile = null;
                this.loadComments();
            },
            error: () => alert('Erro ao enviar comentário.')
        });
    }
}
