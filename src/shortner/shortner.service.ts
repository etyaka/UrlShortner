import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShortnerDto } from './dto';
import { Shortner } from './schemas/shortner.schema';
import { nanoid } from 'nanoid';

@Injectable({})
export class ShortnerService{
    constructor(@InjectModel(Shortner.name) private readonly shortnerModel:Model<Shortner>){}
    
    createShortCodeForUrl(){
        return nanoid(6);
    }

    async shortenUrl(dto: CreateShortnerDto){
        const regex = /^[0-9a-zA-Z_]{4,}$/;
        if(dto.shortcode && !regex.test(dto.shortcode)){
            return {
                success:false,
                status: 422,
                error:"Invalid Shortcode"
            };
        }
        const existingObj = await this.findOne(dto);
        if(!existingObj){
            let isShortCodeInReq = true;
            if(!dto.shortcode){
                isShortCodeInReq = false;
                dto.shortcode = this.createShortCodeForUrl();
            }
            try{
                await this.createShortCode(dto);
            }
            catch(err){
                // For duplicate shortcode
                if(err.code = 11000)
                {
                    if(isShortCodeInReq){
                        return {
                            success:false,
                            status: 409,
                            error:"Shortcode already exists"
                        };   
                    }
                    else {
                        dto.shortcode = this.createShortCodeForUrl();
                        await this.createShortCode(dto);
                    }
                }
                else return {
                    success:false,
                    status: 500,
                    error:"Something went wrong"
                }
            }
            return {
                success:true,
                shortcode:dto.shortcode
            };
        }
        else if(existingObj.shortcode == dto.shortcode)
        return {
            success:false,
            status: 409,
            error:"Shortcode already exists"
        };
        return {
            success:false,
            status: 400,
            error:"Url already mapped"
        };
    }

    async getShortcodeStats(shortcode:string){
        const response = await this.shortnerModel.findOne({shortcode});
        if(!response)
        return {
            success:false,
            status:404,
            error:"Shortcode not found"
        }
        else return {
            success:true,
            startDate:response.startDate,
            lastSeenDate:response.lastSeenDate,
            redirectCount:response.redirectCount,
        }
    }

    async getShortcode(shortcode:string){
        const response = await this.shortnerModel.findOneAndUpdate({shortcode},{
            lastSeenDate: Date.now(),
            '$inc':{redirectCount:1}
        });
        if(!response){
            return {
                success:false,
                status:404,
                error:"Shortcode not found"
            }
        }
        else
            return {
                success:true,
                url:response.url
            }
    }

    async findOne(dto:CreateShortnerDto){
        return await this.shortnerModel.findOne({
            $or:[
                {shortcode:dto.shortcode},
                {url: dto.url}
            ]
        });
    }

    async createShortCode(dto:CreateShortnerDto){
        await this.shortnerModel.create(dto);
    }
}