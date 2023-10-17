import { faker } from '@faker-js/faker'
export const user = {
  firstName: faker.person.firstName('male'),
  lastName: faker.person.lastName('male'),
  email: faker.internet.email(),
  countryCode: faker.number.int({
    min: 0,
    max: 30
  }),
  age: faker.number.int({ min: 1, max: 99 }),
  password: faker.internet.password(),
  phoneNumber: faker.number.int({ min: 1000000000, max: 9999999999 }),
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  postalCode: faker.location.zipCode(),
  country: faker.location.country(),
  dateOfBirth:
    faker.date.birthdate().toDateString().match(/\d{2}/)[0] +
    faker.date
      .birthdate()
      .toDateString()
      .match(/\s\w+\s/)[0] +
    faker.date.birthdate().toDateString().match(/\d{4}/)[0],
  gender: faker.person.sex()
}
