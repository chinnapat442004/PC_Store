import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { AddressService } from './address.service'
import { CreateAddressDto } from './dto/create-address.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateAddressDto } from './dto/update-address.dto'

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  create(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(req.user.user_id, dto)
  }

  @Get()
  findMyAddress(@Req() req) {
    console.log(req.user)
    return this.addressService.findMyAddress(req.user.user_id)
  }

  @Get('default')
  findDefault(@Req() req) {
    return this.addressService.findDefault(req.user.user_id)
  }

  @Post('set-default/:id')
  setDefault(@Req() req, @Param('id') id: number) {
    return this.addressService.setDefault(req.user.user_id, id)
  }


  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: UpdateAddressDto,
  ) {

    return this.addressService.update(req.user.user_id, id, dto)
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: number) {
    return this.addressService.remove(req.user.user_id, id)
  }
}