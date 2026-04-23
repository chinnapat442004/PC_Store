import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Address } from './entities/address.entity'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) { }

  async create(userId: number, dto: CreateAddressDto) {
    const fullAddress = ` ${dto.district} ${dto.province}`

    let lat = dto.lat
    let lng = dto.lng

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
        {
          headers: {
            'User-Agent': 'nestjs-app/1.0 chinnapatpatza@gmail.com',
          },
        }
      )

      const text = await res.text()

      let data = []

      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error('Geocode not JSON:', text)
      }

      if (Array.isArray(data) && data.length > 0) {
        lat = parseFloat(data[0].lat)
        lng = parseFloat(data[0].lon)
      }

    } catch (err) {
      console.error('Geocode API failed:', err)
    }

    const address = this.addressRepo.create({
      ...dto,
      lat,
      lng,
      user_id: userId,
    })

    return this.addressRepo.save(address)
  }

  async findMyAddress(userId: number) {

    return this.addressRepo.find({
      where: { user_id: userId },
      order: { is_default: 'DESC', created_at: 'DESC' },
    })
  }

  async findDefault(userId: number) {
    return this.addressRepo.findOne({
      where: {
        user_id: userId,
        is_default: true,
      },
    })
  }

  async setDefault(userId: number, addressId: number) {
    await this.addressRepo.update(
      { user_id: userId },
      { is_default: false },
    )

    await this.addressRepo.update(
      { address_id: addressId, user_id: userId },
      { is_default: true },
    )

    return { message: 'set default success' }
  }




  async update(userId: number, addressId: number, dto: UpdateAddressDto) {
    const fullAddress = `${dto.district} ${dto.province} ${dto.zipcode}`


    let lat = dto.lat
    let lng = dto.lng

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
        {
          headers: {
            'User-Agent': 'nestjs-app/1.0 chinnapatpatza@gmail.com',
          },
        },
      )

      const text = await res.text()

      let data: any[] = []
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error('Geocode not JSON:', text)
      }

      if (Array.isArray(data) && data.length > 0) {
        lat = parseFloat(data[0].lat)
        lng = parseFloat(data[0].lon)
      }
    } catch (err) {
      console.error('Geocode API failed:', err)
    }

    await this.addressRepo.update(
      { address_id: addressId, user_id: userId },
      {
        ...dto,
        lat,
        lng,
      },
    )

    return { message: 'update success' }
  }


  async remove(userId: number, addressId: number) {
    return this.addressRepo.delete({
      address_id: addressId,
      user_id: userId,
    })
  }
}