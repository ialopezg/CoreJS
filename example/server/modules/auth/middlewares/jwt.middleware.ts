import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { PassportJwtConfig } from '../../../config/passport-jwt.config';
import { Component, IMiddleware } from '../../../../../src';
import { UserService } from '../../user/services';

@Component()
export class JwtMiddleware implements IMiddleware {
  constructor(private readonly userService: UserService) {}

  resolve() {
    return (request: Request, response: Response, next: NextFunction) => {
      const token = request.body.token ||
        request.query.token ||
        request.headers['x-access-token'];

      if (!token) {
        return response.status(400).send({
          success: false,
          message: 'No token provided!'
        });
      }

      jwt.verify(String(token), PassportJwtConfig.secretKey, async (error, decoded) => {
        if (error) {
          return response.status(400).json({
            success: false,
            message: 'Failed to authenticate token!',
          });
        }

        const user = await this.userService.getById((<any>decoded).id);
        if (!user) {
          return response.status(401).json({
            success: false,
            message: 'Wrong credentials provided!',
          });
        }

        (<any>request).user = user;
        next();
      });
    };
  }
}
