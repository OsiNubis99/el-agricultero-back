import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/jwt-auth.guard';
import { RolesAuthGuard } from 'src/api/auth/roles.guard';
import { UserTypeEnum } from '../enums/user-type.enum';
import { BasicRequest, BasicRequestI } from './basic-request';
import { CanAccessRoles } from './can-access-roles.decorator';

export interface AuthRequestI extends BasicRequestI {
  roles?: UserTypeEnum[];
}

export function AuthRequest({ roles, ...data }: AuthRequestI) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesAuthGuard),
    CanAccessRoles(roles || []),
    BasicRequest(data),
  );
}
