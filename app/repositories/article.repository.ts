import { contentFunc, IContentDocument } from '@nuxt/content/types/content';

export type Article = {
  title: string;
  publishedAt: Date;
  path: string;
  body: unknown;
  bodyText: string;
}

export class ArticleRepository {
  private readonly $content: contentFunc
  constructor ($content: contentFunc) {
    this.$content = $content;
  }

  private _getBodyText (node: any): string {
    if (node.type === 'text') {
      return node.value;
    }
    if (node.children) {
      return node.children.map((child: any) => {
        return this._getBodyText(child);
      }).join('');
    }
    return '';
  }

  private _convertPage (page: IContentDocument): Article {
    // TODO: fix `page` type

    // TODO: add validation
    return {
      title: page.title,
      publishedAt: typeof page.publishedAt === 'string' ? new Date(page.publishedAt) : page.publishedAt,
      path: page.path,
      body: page.body,
      bodyText: this._getBodyText(page.body)
    };
  }

  public async fetchArticle (year: string, month: string, slug: string): Promise<Article> {
    const path = ['articles', year, month, slug].join('/');

    const page = await this.$content(path).fetch();

    if (Array.isArray(page)) {
      return Promise.reject(new Error('ArticleRepository: fetched multiple pages'));
    }
    return this._convertPage(page);
  }

  public async fetchArticles (): Promise<Article[]> {
    const pageOrPages = await this.$content('articles', { deep: true }).sortBy('publishedAt', 'desc').fetch();

    const pages = Array.isArray(pageOrPages) ? pageOrPages : [pageOrPages];
    return pages.map(page => this._convertPage(page));
  }
}
