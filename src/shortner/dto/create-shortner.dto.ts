import { IsDataURI, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateShortnerDto {
    @IsOptional()
    @IsString()
    shortcode:string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    url:string;
    
    @IsOptional()
    @IsDataURI()
    startDate: Date;

    @IsOptional()
    @IsDataURI()
    lastSeenDate: Date;

    @IsOptional()
    @IsInt()
    redirectCount:number;
}