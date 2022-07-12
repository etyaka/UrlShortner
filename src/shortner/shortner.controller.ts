import { Body, Controller, Get, HttpStatus, Param, Post, Res, Logger } from '@nestjs/common';
import { CreateShortnerDto } from './dto';
import { ShortnerService } from './shortner.service';

@Controller()
export class ShortnerController{
    constructor(private shortnerService:ShortnerService){}
    private readonly logger = new Logger(ShortnerController.name);

    @Post('shorten')
    async shortenUrl(@Body() dto:CreateShortnerDto,@Res() res){
        const requestStartTime = Date.now();
        try{
            const result = await this.shortnerService.shortenUrl(dto);
            if(result.success == true)
            {
                this.logger.log(`Response Time: ${Date.now() - requestStartTime}ms`);
                return res.status(HttpStatus.CREATED).json({
                    shortcode:result.shortcode
                });
            }
            else 
            {
                this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
                return res.status(result.status).json({
                    Error:result.error
                })
            }
        }
        catch(err){
            console.log("error",err);
            this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
            return res.status(500).json({
                Error: 'Error: Something went wrong'
              });
        }
    }

    @Get(':id/stats')
    async getShortcodeStats(@Param("id") id:string, @Res() res){
        const requestStartTime = Date.now();
        try{
            const requestStartTime = Date.now();
            const result = await this.shortnerService.getShortcodeStats(id);
            if(result.success == false){
                this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
                return res.status(result.status).json({
                    Error: result.error
                });
            }
            else{
                this.logger.log(`Response Time: ${Date.now() - requestStartTime}ms`);
                return res.status(HttpStatus.OK).json({
                    startDate:result.startDate,
                    lastSeenDate:result.lastSeenDate,
                    redirectCount:result.redirectCount,
                })
            }
        }
        catch(err){
            this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
            return res.status(500).json({
                Error: 'Error: Something went wrong'
              });
        }
    }
    
    @Get(':id')
    async getShortcode(@Param("id") id:string, @Res() res){
        const requestStartTime = Date.now();
        try{
            const requestStartTime = Date.now();
            const result = await this.shortnerService.getShortcode(id);
            if(result.success == false){
                this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
                return res.status(result.status).json({
                    Error: result.error
                });
            }
            else{
                this.logger.log(`Response Time: ${Date.now() - requestStartTime}ms`);
                res.set({Location:result.url});
                return res.status(302).json({})
            }
        }
        catch(err){
            console.log("err",err);
            this.logger.error(`Response Time: ${Date.now() - requestStartTime}ms`);
            return res.status(500).json({
                Error: 'Error: Something went wrong'
              });
        }
    }
}