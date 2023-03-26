import { PageMetaDtoParameters } from './page-options.dto';

export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly previousPage: string;

  constructor({
    itemCount,
    pageOptionsDto: { page, limit },
  }: PageMetaDtoParameters) {
    this.page = page;
    this.limit = limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
