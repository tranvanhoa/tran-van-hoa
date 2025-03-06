import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { UserRepository } from 'src/data/repositories/user.repository';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRo } from '../../response-objects/user.ro';
import { SuccessResponse } from 'src/core/interfaces/success.response';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand): Promise<BaseResponse<UserRo>> {
    const userEmail = command.loginDto.email.toLowerCase();
    const userToAttempt = await this.usersRepository.findOne({
      where: {
        email: userEmail,
      },
    });
    if (userToAttempt == null) throw new NotFoundException();
    const isMatch = await userToAttempt.checkPassword(
      command.loginDto.password,
    );
    if (!isMatch)
      throw new UnauthorizedException('Incorrect Password or Email.');

    const { id, email } = userToAttempt;

    const payload = {
      id,
      email,
    };
    const token = this.jwtService.sign(payload);

    return new SuccessResponse({
      id,
      email,
      token,
    });
  }
}
