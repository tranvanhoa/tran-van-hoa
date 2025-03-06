import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from '../handlers/register/register.dto';
import { UserCreatedRo, UserRo } from '../response-objects/user.ro';
import { RegisterCommand } from '../handlers/register/register.command';
import { LoginDto } from '../handlers/login/login.dto';
import { LoginCommand } from '../handlers/login/login.command';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authen')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Register',
    description: 'Register a new user',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<UserCreatedRo> {
    return this.commandBus.execute(new RegisterCommand(dto));
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<UserRo> {
    return this.commandBus.execute(new LoginCommand(dto));
  }
}
