import { Injectable } from '@nestjs/common'
import type { AppSetting } from '@app/database'
import { SettingRepository } from '@/domains/settings/repository/setting.repository'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaSettingRepository extends SettingRepository {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  findAll(): Promise<AppSetting[]> {
    return this.prisma.appSetting.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })
  }

  findByKeys(keys: string[]): Promise<AppSetting[]> {
    return this.prisma.appSetting.findMany({ where: { key: { in: keys } } })
  }

  async updateValue(key: string, value: string): Promise<void> {
    await this.prisma.appSetting.update({ where: { key }, data: { value } })
  }
}
