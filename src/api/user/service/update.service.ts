import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AppServiceI } from 'src/common/generics/app-service.interface';
import { Either } from 'src/common/generics/either';
import { UserDocument } from 'src/database/schemas/user.schema';
import { UpdateDto } from '../dto/update.dto';

type P = UpdateDto & { user: UserDocument };

type L = HttpException;

type R = UserDocument;

@Injectable()
export class UpdateService implements AppServiceI<P, L, R> {
  constructor() {}

  async execute({ user, ...body }: P) {
    if (body.password && body.password !== body.confirmPassword) {
      return Either.makeLeft<L, R>(
        new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST),
      );
    }

    user.name = body.name;
    const salt = await bcrypt.genSalt(7);
    user.password = await bcrypt.hash(body.password, salt);

    await user.save();

    return Either.makeRight<L, R>(user);
  }
}
