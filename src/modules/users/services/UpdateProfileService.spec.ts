import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'


let fakeHashProvider: FakeHashProvider
let fakeUsersRepository: FakeUsersRepository
let updateUserProfile: UpdateProfileService

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider()
        fakeUsersRepository = new FakeUsersRepository()
        updateUserProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
    })

    it('should be able to update the profile', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const updatedUser = await updateUserProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com'
        })

        expect(updatedUser.name).toBe('John Trê')
        expect(updatedUser.email).toBe('johntre@example.com')
    })

    it('should be able to show the profile from non-existing user', async () => {

        expect(updateUserProfile.execute({
            user_id: 'non-existing-user',
            name: 'Test',
            email: 'test@example.com'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to change to another user email', async () => {

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456'
        })

        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johndoe@gmail.com'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to update the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const updatedUser = await updateUserProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            old_password: '123456',
            password: '123123',
        })

        expect(updatedUser.password).toBe('123123')
    })

    it('should not be able to update the password without old password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to update the password with wrong old password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })



        await expect(updateUserProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            old_password: '123434456',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError)
    })
})
