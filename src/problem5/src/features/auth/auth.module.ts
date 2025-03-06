import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtSecret, tokenExpired } from 'src/app.config';
import { DataModule } from 'src/data/data.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { commandHandlers } from './handlers';

@Module({
  imports: [
    DataModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: tokenExpired,
      },
    }),
  ],
  providers: [JwtStrategy, ...commandHandlers],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
