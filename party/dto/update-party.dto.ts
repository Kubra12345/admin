import { PartialType } from '@nestjs/mapped-types';
import { CreatePartyDto } from './create-party.dto';

export class UpdatePartyDto extends PartialType(CreatePartyDto) {
  name?: string;
  permissions?: [];
}
