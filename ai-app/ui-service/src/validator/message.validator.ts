import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'An array of messages',
    example: [
      'Purchase of AED 43.50 with Credit Card ending 4070 at ZOYA PALACE RESTAURANT, Abu Dhabi. Avl Cr. Limit is AED 15,629.26',
      'Purchase of AED 726.00 with Credit Card ending 4070 at Lulu Hypermarket Wahda, Abu Dhabi. Avl Cr. Limit is AED 15,672.76',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Message array should not be empty' })
  @IsString({ each: true, message: 'Each Message must be a string' })
  readonly messages: string[];

  @ApiProperty({
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID should not be empty' })
  readonly userId: string;
}
