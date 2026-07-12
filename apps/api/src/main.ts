import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use(
    '/reference',
    apiReference({
      theme: 'default',
      content: document,
    }),
  )

  const port = process.env['PORT'] ?? 3000
  await app.listen(port)
  Logger.log(`🚀  Server running on  http://localhost:${port}`)
  Logger.log(`📖  API reference     http://localhost:${port}/reference`)
}
void bootstrap()
