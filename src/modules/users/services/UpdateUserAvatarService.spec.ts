import AppError from '@shared/errors/AppError'

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository'
import UpdateUserAvatar from './UpdateUserAvatarService'

describe('UpdateUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeStorageProvider = new FakeStorageProvider()
        const fakeUsersRepository = new FakeUsersRepository()

        const updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        expect(user.avatar).toBe('avatar.jpg')
    })

    it('should not be able to update avatar from non existing user', async () => {
        const fakeStorageProvider = new FakeStorageProvider()
        const fakeUsersRepository = new FakeUsersRepository()

        const updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should delete old avatar when updating new one', async () => {
        const fakeStorageProvider = new FakeStorageProvider()
        const fakeUsersRepository = new FakeUsersRepository()

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

        const updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        })

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
        expect(user.avatar).toBe('avatar2.jpg')
    })

})
