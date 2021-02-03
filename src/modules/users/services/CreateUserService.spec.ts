import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fake/FakeUsersRepository'
import CreateUserService from './CreateUserService'

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const createUserService = new CreateUserService(fakeUsersRepository)

        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with an exist email', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const createUserService = new CreateUserService(fakeUsersRepository)

        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
    })
})