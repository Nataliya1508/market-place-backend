import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<number>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
        // ssl:
        //   configService.get<string>('DATABASE_SSL_ENABLED') === 'true'
        //     ? {
        //         rejectUnauthorized:
        //           configService.get<string>('DATABASE_REJECT_UNAUTHORIZED') ===
        //           'true',
        //       }
        //     : undefined,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/**/*{.ts, .js}'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([]),
    UserModule,
    BuyerModule,
    SellerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
