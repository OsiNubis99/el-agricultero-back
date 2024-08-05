import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { File } from 'src/database/schemas/file.schema';

export class CreateDocumentDto {
  @IsNotEmpty()
  @ApiProperty({
    type: File['name'],
  })
  name: File['name'];

  @IsNotEmpty()
  @ApiProperty({
    type: File['media'],
  })
  media: File['media'];

  @IsNotEmpty()
  @ApiProperty({
    type: File['picture'],
  })
  picture: File['picture'];
}
