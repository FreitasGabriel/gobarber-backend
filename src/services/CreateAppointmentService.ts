import Appointment from '../models/Appointment'
import { startOfHour } from 'date-fns'
import AppointmentsRepoository from '../repositories/AppointmentsRepoository'

interface Request {
    provider: string
    date: Date
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepoository

    constructor(appointmentsRepository: AppointmentsRepoository) {
        this.appointmentsRepository = appointmentsRepository
    }

    public execute({ date, provider }: Request): Appointment {
        const appointmentDate = startOfHour(date)

        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
            appointmentDate
        )

        if (findAppointmentInSameDate) {
            throw Error('This apppointment it already booked!')
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate,
        })

        return appointment
    }
}

export default CreateAppointmentService
