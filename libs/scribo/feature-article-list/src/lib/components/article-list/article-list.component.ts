import { Component, inject, OnInit } from '@angular/core';
import { ArticleStore } from '@mpp/scribo/data-access';

@Component({
  selector: 'scrb-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  imports: [],
})
export class ArticleListComponent implements OnInit {
  private readonly articleStore = inject(ArticleStore);

  ngOnInit(): void {
    this.articleStore.loadAll();
  }
  articleList = this.articleStore.getArticles;
}
