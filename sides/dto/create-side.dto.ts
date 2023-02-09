import { IsNotEmpty } from 'class-validator';

export class CreateSideDto {
  @IsNotEmpty()
  name: string;
}
