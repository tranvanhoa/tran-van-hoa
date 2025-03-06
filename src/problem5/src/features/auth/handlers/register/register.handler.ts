import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { UserRepository } from 'src/data/repositories/user.repository';
import { UserCreatedRo } from '../../response-objects/user.ro';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { BadRequestException } from '@nestjs/common';
import { SuccessResponse } from 'src/core/interfaces/success.response';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(private usersRepository: UserRepository) {}

  async execute(
    command: RegisterCommand,
  ): Promise<BaseResponse<UserCreatedRo>> {
    const { email, password, firstName, lastName } = command.dto;
    const existUser = await this.usersRepository.findOne({ where: { email } });
    if (existUser != null) {
      throw new BadRequestException('User exist');
    }
    const newUser = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
    });
    await newUser.save();
    return new SuccessResponse({ id: newUser.id, email: newUser.email });
  }
}
