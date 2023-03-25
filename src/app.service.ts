import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getExpenses(): string {
    return 'Hello World!';
  }
}
