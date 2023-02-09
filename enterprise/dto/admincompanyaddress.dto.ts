import { IsNumber } from 'class-validator';

export class AdminCreateCompanyAddressDto {
  id?: number;

  address?: string;

  state?: string;

  city?: string;

  country?: string;

  zip?: string;

  branchName?: string;
}
