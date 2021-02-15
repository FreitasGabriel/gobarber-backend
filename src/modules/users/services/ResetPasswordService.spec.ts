import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fake/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fake/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPasswordService: ResetPasswordService

describe('ResetPasswordService', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeUserTokensRepository = new FakeUserTokensRepository()
        fakeHashProvider = new FakeHashProvider()
        resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider)
    })


    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')


        await resetPasswordService.execute({
            token: token,
            password: '12345678',
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(generateHash).toHaveBeenCalledWith('12345678')
        expect(updatedUser?.password).toBe('12345678')
    })

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(resetPasswordService.execute({
            token: 'non-existing-token',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password with non-existing user', async () => {

        const { token } = await fakeUserTokensRepository.generate('non-existing-token')

        await expect(resetPasswordService.execute({
            token,
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to reset the password if passed more than 2 hours', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date()

            return customDate.setHours(customDate.getHours() + 3)
        })

        await expect(resetPasswordService.execute({
            token: token,
            password: '12345678',
        })).rejects.toBeInstanceOf(AppError)

    })

})
