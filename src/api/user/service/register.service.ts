import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthService } from 'src/api/auth/auth.service';
import { StatusEnum } from 'src/common/enums/status.enum';
import { AppServiceI } from 'src/common/generics/app-service.interface';
import { User } from 'src/database/schemas/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { Either } from 'src/common/generics/either';
import { UserTypeEnum } from 'src/common/enums/user-type.enum';

type P = RegisterDto;

type L = HttpException;

type R = string;

@Injectable()
export class RegisterService implements AppServiceI<P, L, R> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async execute(body: P) {
    if (await this.userModel.findOne({ email: body.email })) {
      return Either.makeLeft<L, R>(
        new HttpException(
          'BAD_REQUEST: Email is already used',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    if (body.password && body.password !== body.confirmPassword) {
      return Either.makeLeft<L, R>(
        new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST),
      );
    }

    const user = new this.userModel({
      type: body.type,
      email: body.email,
      name: body.name,
    });
    const salt = await bcrypt.genSalt(7);
    user.password = await bcrypt.hash(body.password, salt);
    await user.save();

    if (body.type === UserTypeEnum.ADMIN) {
      user.status = StatusEnum.ACTIVE;
      await user.save();
    } else {
      this.authService.emailValidation(user.email);
    }

    return Either.makeRight<L, R>('OK');
  }
}
