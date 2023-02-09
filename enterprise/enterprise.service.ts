import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Where } from 'src/common/where';
import { CompanyService } from 'src/company/company.service';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Injectable()
export class EnterpriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const checkCompany = await this.prisma.company.findUnique({
      where: {
        nameInLowerCase: createCompanyDto.companyName
          .toLowerCase()
          .trim(),
      },
    });
    if (checkCompany)
      throw new HttpException('Company already exists', HttpStatus.BAD_REQUEST);

    const checkCompanyPhone = await this.prisma.company.findUnique({
      where: {
        workPhone: createCompanyDto.workPhone,
      },
    });
    const checkPhone = await this.prisma.user.findUnique({
      where: {
        phone: createCompanyDto.workPhone,
      },
    });
    if (checkCompanyPhone || checkPhone)
      throw new HttpException(
        'Phone number of company already exists',
        HttpStatus.BAD_REQUEST,
      );
    const companyDto: CreateCompanyDto = {
      companyName: createCompanyDto.companyName,
      nameInLowerCase: createCompanyDto.companyName
        .toLowerCase()
        .trim(),
      workPhone: createCompanyDto.workPhone,
      logo: createCompanyDto.logo,
      address: {
        state: createCompanyDto.address.state,
        city: createCompanyDto.address.city,
        address: createCompanyDto.address.address,
        country: createCompanyDto.address.country,
        zip: createCompanyDto.address.zip,
      },
    };
    return this.companyService.create(companyDto);
  }

  async findAll(limit: number, offset: number, filter: Where) {
    let where:Where = {
      deletedAt: null,
      isVerified: true,         
    }
    if (filter.name) {    
      where.name =  { contains: filter.name, mode: 'insensitive' } 
   
    }   
    if (filter.isBlock !== undefined) {
      where.block = filter.isBlock
    }
    if (filter.country) {
      ///filtering country in related model CompanyAddress
      where.addresses = {
          some: {
          // country: filter.country 
            country:{ contains: filter.country, mode: 'insensitive' } 
          },
      }
    }
    const data = await this.prisma.company.findMany({
      where,
      include: { addresses: { where: { deletedAt: null } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    const count = await this.prisma.company.findMany({
      where
    });
    return {
      list: data,
      total: count.length,
    };
  }

  findOne(id: number) {
    return this.prisma.company.findFirst({
      where: { id: id },
      include: { addresses: {where: {deletedAt: null}} },
    });
  }

  async update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    const companyUpdate = await this.prisma.company.update({
      where: { id: id },
      data: {
        name: updateEnterpriseDto.companyName,
        nameInLowerCase: updateEnterpriseDto.companyName
          .toLowerCase()
          .trim(),
        workPhone: updateEnterpriseDto.workPhone,
        logo: updateEnterpriseDto.logo,
      },
    });

    const addressUpdate = await this.prisma.companyAddress.update({
      where: {
        id: updateEnterpriseDto.address.id,
      },
      data: {
        state: updateEnterpriseDto.address.state,
        city: updateEnterpriseDto.address.city,
        address: updateEnterpriseDto.address.address,
        country: updateEnterpriseDto.address.country,
        zip: updateEnterpriseDto.address.zip,
      },
    });
    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} enterprise`;
  }

  async blockEnterprise(id: number) {
    const enterprise = await this.prisma.company.findFirst({
      where: { id: id },
    });
    if (!enterprise)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    if (enterprise.block) {
      return this.prisma.company.update({
        where: { id: id },
        data: { block: false },
        include: { addresses: true },
      });
    } else {
      return this.prisma.company.update({
        where: { id: id },
        data: { block: true },
        include: { addresses: true },
      });
    }
  }
}
