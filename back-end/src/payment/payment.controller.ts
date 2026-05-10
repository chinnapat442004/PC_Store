import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import cloudinary from 'config/cloudinary.config';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':paymentId/slip')
  @UseInterceptors(
    FileInterceptor('slip_image', {
      storage: memoryStorage(),
    }),
  )
  async uploadSlip(
    @Param('paymentId') paymentId: number,
    @UploadedFile() slip_image: Express.Multer.File,
  ) {
    if (!slip_image) {
      throw new BadRequestException('Slip image is required');
    }

    const uploadedSlip = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'payments/slips',
          format: 'webp',
          transformation: [
            { width: 400, crop: 'limit' }, // ถ้าภาพใหญ่กว่า 1200px จะถูกย่อลงมา
          ],
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return reject(error);
          }

          const optimizedUrl = cloudinary.url(result.public_id, {
            secure: true,
            format: 'webp',
            quality: 'auto',
            width: 400,
            crop: 'limit',
          });

          resolve(optimizedUrl);
        },
      );

      stream.end(slip_image.buffer);
    });

    return this.paymentService.uploadSlip(paymentId, uploadedSlip);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':orderId/qr')
  async getPaymentQR(@Param('orderId') orderId: number) {
    return this.paymentService.getPaymentInfo(orderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findByOrderId(+id);
  }
}
