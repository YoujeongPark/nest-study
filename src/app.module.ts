import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as mongoose from "mongoose";

@Module({
  imports: [
    ConfigModule.forRoot(),    
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser : true,
      useUnifiedTopology : true,
      useCreateIndex : true,
      useFindAndModify : false, 
    }),
    CatsModule
    ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  private readonly isDev : boolean = process.env.Mode === 'dev' ? true : false; 
  configure(consumer : MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('cats');
    mongoose.set('debug', this.isDev);
  }
}{}
