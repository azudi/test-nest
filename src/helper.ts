import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';


export const checkIdIsValid = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
};

export const checkIdResponseIsValid = (id: any) => {
  const isValid = (id !== null);
  if (!isValid) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
};

export const generateHashedPassword = (value: string) => {
  return bcrypt.hash(value, 10);
};