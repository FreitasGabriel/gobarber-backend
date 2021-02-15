import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'
import User from '../infra/typeorm/entities/User'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('IUsersRepository')
        private usersRepostirory: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository
    ) { }

    public async execute({ email }: IRequest): Promise<void> {

        const user = await this.usersRepostirory.findByEmail(email)

        if (!user) {
            throw new AppError('User does not exist')
        }

        await this.userTokensRepository.generate(user.id)


        this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido')
    }
}

export default SendForgotPasswordEmailService
