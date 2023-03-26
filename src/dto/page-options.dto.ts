export class PageOptionsDto {
  readonly order?: 'ASC' | 'DESC' = 'ASC';
  readonly page?: number = 1;
  readonly limit?: number = 10;
  
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
