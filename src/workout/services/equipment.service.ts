import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IEquipmentDto } from '../dtos/IEquipment.dto';
import { IEquipment } from '../entities/IEquipment.entity';

@Injectable()
export class EquipmentService {
  constructor(@InjectRepository(IEquipment) private equipmentRepo: Repository<IEquipment>) {}

  findAll(skip: number, take: number): Promise<Array<IEquipment>> {
    if (skip >= 0 && take) {
      return this.equipmentRepo.find({
        take,
        skip,
      });
    }
    return this.equipmentRepo.find();
  }

  findOne(id: number): Promise<IEquipment> {
    return this.equipmentRepo.findOneBy({ id });
  }

  findByName(name: string): Promise<IEquipment> {
    return this.equipmentRepo.findOneBy({
      name,
    });
  }

  async create(entity: IEquipmentDto) {
    try {
      const equipment = await this.findByName(entity.name);
      if (equipment) throw new BadRequestException('The equipment name is already in use');
      const newEquipment = await this.equipmentRepo.create(entity);
      return await this.equipmentRepo.save(newEquipment);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: IEquipmentDto) {
    try {
      const equipment = await this.findOne(id);
      if (!equipment) {
        throw new NotFoundException('The equipment was not found');
      }
      this.equipmentRepo.merge(equipment, payload);
      return await this.equipmentRepo.save(equipment);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const equipment = await this.findOne(id);
      if (!equipment) {
        throw new NotFoundException('Equipment was not found');
      }
      return this.equipmentRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
