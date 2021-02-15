import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fake/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUserService: CreateUserService

describe('CreateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    })


    it('should be able to create a new user', async () => {

        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with an exist email', async () => {

        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await expect(createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
    })
})
