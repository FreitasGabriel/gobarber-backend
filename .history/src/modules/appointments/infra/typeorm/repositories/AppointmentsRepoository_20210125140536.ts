import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '../entities/Appointment'
import { getRepository, Repository } from 'typeorm'

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository = Repository < Appointment >

        constructor() {
    this.ormRepository = getRepository(Appointment)
}

    public async findByDate(date: Date): Promise < Appointment | undefined > {
    const findAppointment = await this.findOne({
        where: { date },
    })

        return findAppointment
}
}

export default AppointmentsRepository
