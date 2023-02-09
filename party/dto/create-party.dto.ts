import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class CreatePartyDto {
  name?: string;

  permissions: [];
  // @ValidateNested()
  // @Type(() => CreatePermissionDto)
  // permission: CreatePermissionDto;
}
