import { Test } from "@nestjs/testing";
import { CreateShortnerDto } from "./dto";
import { ShortnerController } from "./shortner.controller";
import { ShortnerService } from "./shortner.service";

describe('ShortnerController',()=>{

    let shortnerController: ShortnerController;
    let shortnerService: ShortnerService;
    const mockUrl = "http://test.com";

    const mockResponse = () => {
        let res = {status:jest.fn(),json:jest.fn(),set:jest.fn()};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.set = jest.fn().mockReturnValue(mockUrl);
        return res;
      };

      describe("Failed ShortnerController",()=>{
        describe("shortenUrl",()=>{
            const mockShortnerServiceForFailure = {
                shortenUrl: jest.fn(async(dto)=>{
                    return {
                        success:false,
                        status: 400,
                        error:"Invalid url"
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForFailure).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            });    
            it('should fail for an empty request object',async ()=>{
                const dto = new CreateShortnerDto();
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.shortenUrl(dto,tRes);
                expect(tRes.status).toBeCalledWith(400);
            });
            it('should fail for a request with missing url',async ()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "abcde";
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.shortenUrl(dto,tRes);
                expect(tRes.status).toBeCalledWith(400);
            });
            it('should fail for a request with invalid regex of shortcode',async()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "ab*";
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.shortenUrl(dto,tRes);
                expect(tRes.status).toBeCalledWith(400);
            });
        })
        describe("getShortcode",()=>{
            const mockShortnerServiceForFailure = {
                getShortcode: jest.fn(async(dto)=>{
                    return {
                        success:false,
                        status: 404,
                        error:"Invalid url"
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForFailure).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            }); 
            it('should return 404 for a non existent shortcode',async ()=>{
                const dto = new CreateShortnerDto();
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.getShortcode(null,tRes);
                expect(tRes.status).toBeCalledWith(404);
            });
        })
        describe("getShortcodeStats",()=>{
            const mockShortnerServiceForFailure = {
                getShortcodeStats: jest.fn(async(dto)=>{
                    return {
                        success:false,
                        status: 404,
                        error:"Invalid url"
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForFailure).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            }); 
            it('should return 404 for an invalid shortcode',async ()=>{
                const dto = new CreateShortnerDto();
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.getShortcodeStats(null,tRes);
                expect(tRes.status).toBeCalledWith(404);
            });
        })
      });

      describe("Passed ShortnerController",()=>{
        describe("shortenUrl",()=>{
            const mockShortnerServiceForSuccess = {
                shortenUrl: jest.fn(async(dto)=>{
                    return {
                        success:true,
                        status: 200,
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForSuccess).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            });
            it('should be defined',()=>{
                expect(shortnerController).toBeDefined();
            });
            it('should pass for a request with valid shortcode and valid url',async()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "abcde";
                dto.url = "http://test.com";
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.shortenUrl(dto,tRes);
                expect(tRes.status).toBeCalledWith(201);
            });
            it('should pass for a request with valid url without shortcode',async()=>{
                const dto = new CreateShortnerDto();
                dto.url = "http://test.com";
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.shortenUrl(dto,tRes);
                expect(tRes.status).toBeCalledWith(201);
            });
        })
        describe("getShortcode",()=>{
            const mockShortnerServiceForSuccess = {
                getShortcode: jest.fn(async(dto)=>{
                    return {
                        success:true,
                        url:mockUrl,
                        status: 302
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForSuccess).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            });
            it('should be defined',()=>{
                expect(shortnerController).toBeDefined();
            });
            it('should redirect to the respective url for a request with valid shortcode',async()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "abcde";
                dto.url = mockUrl;
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                jest.spyOn(tRes,'set');
                await shortnerController.getShortcode("abc",tRes);
                expect(tRes.status).toBeCalledWith(302);
                expect(tRes.set).toBeCalledWith({"Location":mockUrl});
            });
        })
        describe("getShortcodeStats",()=>{
            const obj = {
                startDate:Date.now(),
                lastSeenDate:Date.now(),
                redirectCount:2,
            }
            const mockShortnerServiceForSuccess = {
                getShortcodeStats: jest.fn(async(dto)=>{
                    return {
                        success:true,
                        status: 200,
                        startDate:obj.startDate,
                        lastSeenDate:obj.lastSeenDate,
                        redirectCount:obj.redirectCount,
                    }
                })
            }
            beforeEach(async()=>{
                const module = await Test.createTestingModule({
                    controllers:[ShortnerController],
                    providers: [ShortnerService]
                }).overrideProvider(ShortnerService).useValue(mockShortnerServiceForSuccess).compile();
                shortnerController = module.get<ShortnerController>(ShortnerController);
                shortnerService = module.get<ShortnerService>(ShortnerService);
            });
            it('should be defined',()=>{
                expect(shortnerController).toBeDefined();
            });
            it('should return an OK response for a request with valid shortcode',async()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "abcde";
                dto.url = "http://test.com";
                let tRes = mockResponse();
                jest.spyOn(tRes,'status');
                await shortnerController.getShortcodeStats("abc",tRes);
                expect(tRes.status).toBeCalledWith(200);
            });
            it('should return all 3 fields in the response',async()=>{
                const dto = new CreateShortnerDto();
                dto.shortcode = "abcde";
                dto.url = "http://test.com";
                let tRes = mockResponse();
                jest.spyOn(tRes,'json');
                await shortnerController.getShortcodeStats("abc",tRes);
                expect(tRes.json).toBeCalledWith({
                    startDate:obj.startDate,
                    lastSeenDate:obj.lastSeenDate,
                    redirectCount:obj.redirectCount
                });
            });
        })
      });
})