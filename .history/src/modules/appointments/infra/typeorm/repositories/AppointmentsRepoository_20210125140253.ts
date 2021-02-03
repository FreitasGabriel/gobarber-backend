import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '../entities/Appointment'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Appointment)
class AppointmentsRepository implements IAppointmentsRepository {
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.findOne({
            where: { date },
        })

        return findAppointment
    }
}

export default AppointmentsRepository