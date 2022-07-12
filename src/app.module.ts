import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortnerModule } from './shortner/shortner.module';

@Module({
  imports: [ShortnerModule,MongooseModule.forRoot('mongodb://localhost:27017')],
  controllers: [],
  providers: [],
})
export class AppModule {}
