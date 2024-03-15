import Joi from 'joi';

export class CarValidator {
  static brand = Joi.string().min(3).max(15);
  static year = Joi.number().min(1990).max(new Date().getFullYear());
  static price = Joi.number().min(0).max(1000000);
  static description = Joi.string();
  static photo = Joi.string();
  static video = Joi.string();
  static _user = Joi.object();

  static create = Joi.object({
    brand: this.brand.required(),
    year: this.year.required(),
    price: this.price.required(),
    description: this.description.required(),
    photo: this.photo,
    video: this.video,
  });

  static update = Joi.object({
    brand: this.brand,
    year: this.year,
    price: this.price,
    description: this.description,
    photo: this.photo,
    video: this.video,
  });
}
