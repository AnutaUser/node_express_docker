import { configs } from '../configs';
import { ICar, IUser } from '../types';

class CarMapper {
  public carWithUserForResponse(car: ICar, user: IUser) {
    return {
      _id: car._id,
      brand: car.brand,
      price: car.price,
      year: car.year,
      description: car.description,
      photo: car.photo ? `${configs.AWS_S3_URL}/${car.photo}` : null,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
      _user: {
        _id: user._id,
        username: user.username,
        age: user.age,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        status: user.status,
        photo: user.photo ? `${configs.AWS_S3_URL}/${user.photo}` : null,
        video: user.video ? `${configs.AWS_S3_URL}/${user.video}` : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  public carForResponse(car: ICar) {
    return {
      _id: car._id,
      brand: car.brand,
      price: car.price,
      year: car.year,
      description: car.description,
      photo: car.photo ? `${configs.AWS_S3_URL}/${car.photo}` : null,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    };
  }
}

export const carMapper = new CarMapper();
