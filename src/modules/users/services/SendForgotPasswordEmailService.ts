import { injectable, inject } from 'tsyringe'
import path from 'path'

import IUsersRepository from '../repositories/IUsersRepository'
import IUsersTokensRepository from '../repositories/IUserTokensRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

import AppError from '@shared/errors/AppError'

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepostirory: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUsersTokensRepository
    ) { }

    public async execute({ email }: IRequest): Promise<void> {

        const user = await this.usersRepostirory.findByEmail(email)

        if (!user) {
            throw new AppError('User does not exist')
        }

        const { token } = await this.userTokensRepository.generate(user.id)

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')


        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`
                }
            }
        })
    }
}

export default SendForgotPasswordEmailService