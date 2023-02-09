import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AdminCreateCompanyAddressDto } from './admincompanyaddress.dto';
import { CreateEnterpriseDto } from './create-enterprise.dto';

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {
  nameInLowerCase?: string;
  companyName?: string;
  block?: boolean;
  workPhone?: string;
  logo?: string;
  @ValidateNested()
  @Type(() => AdminCreateCompanyAddressDto)
  address: AdminCreateCompanyAddressDto;
}
