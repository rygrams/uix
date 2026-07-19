import { BadRequestException, Body, Controller, Get, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '@thallesp/nestjs-better-auth'
import { ListSettingsUseCase } from '@/domains/settings/use-cases/list-settings.use-case'
import { UpdateSettingsUseCase } from '@/domains/settings/use-cases/update-settings.use-case'
import { DomainError } from '@/shared/errors/domain.error'

@ApiTags('settings')
@ApiBearerAuth()
@Roles(['admin', 'superadmin'])
@Controller('admin/settings')
export class SettingsController {
  constructor(
    private readonly listSettings: ListSettingsUseCase,
    private readonly updateSettings: UpdateSettingsUseCase,
  ) {}

  @Get()
  async list() {
    return { settings: await this.listSettings.execute() }
  }

  @Put()
  async update(@Body() body: unknown) {
    try {
      await this.updateSettings.execute(body)
    } catch (error) {
      if (error instanceof DomainError) {
        throw new BadRequestException({ code: error.code, message: error.message })
      }
      throw error
    }

    return { settings: await this.listSettings.execute() }
  }
}
