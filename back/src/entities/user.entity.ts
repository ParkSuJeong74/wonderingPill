import { User as UserModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements UserModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  profileImg: string;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  birth: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
