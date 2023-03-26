import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  readonly data: T[];
  readonly paging: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.paging = meta;
  }
}
