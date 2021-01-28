import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth'
import { compare } from 'bcryptjs'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'

import User from '../infra/typeorm/entities/User'

interface IRequest {
    email: string
    password: string
}

interface IResponse {
    user: User
    token: string
}

class AuthenticateUserService {

    constructor(private usersRepository: IUsersRepository) { }

    public async execute({ email, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new AppError('Incorrect email/password combination!', 401)
        }
        // user.password - senha criptografada
        // password - senha não criptografada que vem do body da request

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError('Inconrrect email/password combination!', 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        })

        return {
            user,
            token,
        }
    }
}

export default AuthenticateUserService
