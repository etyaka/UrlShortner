import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shortner, ShortnerSchema } from './schemas/shortner.schema';
import { ShortnerController } from './shortner.controller';
import { ShortnerService } from './shortner.service';

@Module({
    imports:[MongooseModule.forFeature([{
        name: Shortner.name,schema: ShortnerSchema
    }])],
    controllers:[ShortnerController],
    providers:[ShortnerService]
})
export class ShortnerModule {
    
}