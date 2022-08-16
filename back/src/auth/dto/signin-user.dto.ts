import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsJSON,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { CommonResponseDto } from 'src/common/dto';

export class SigninUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isSignin: boolean;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}

export class SigninResponse extends CommonResponseDto {
  @IsJSON()
  @IsNotEmpty()
  @ApiProperty()
  user: {
    id: string;
    email: string;
    name: string;
    profileImg: string;
    provider: string;
  };
}

export class LogoutResponse extends CommonResponseDto {
  @IsJSON()
  @IsNotEmpty()
  @ApiProperty()
  checkLogout: {
    checkLogout: boolean;
  };
}

export class OauthLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  profileImg: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
