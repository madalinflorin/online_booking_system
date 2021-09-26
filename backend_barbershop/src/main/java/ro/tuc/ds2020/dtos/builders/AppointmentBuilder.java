package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.AppointmentCalendarViewDTO;
import ro.tuc.ds2020.dtos.AppointmentDTO;
import ro.tuc.ds2020.dtos.AppointmentViewUserDTO;
import ro.tuc.ds2020.entities.Appointment;

import java.util.stream.Collectors;

public class AppointmentBuilder {
    private AppointmentBuilder() {}

    public static AppointmentDTO toDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getBarber().getId(),
                appointment.getUser().getId(),
                appointment.getStartAppointment(),
                appointment.getEndAppointment(),
                appointment.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet()),
                appointment.getPrice()
        );
    }

    public static AppointmentViewUserDTO toDTOForUser(Appointment appointment) {
        return new AppointmentViewUserDTO(
                appointment.getId(),
                appointment.getBarber().getName(),
                appointment.getStartAppointment(),
                appointment.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet()),
                appointment.getPrice()
        );
    }

    public static AppointmentCalendarViewDTO toDTOForCalendar(Appointment appointment) {
        return new AppointmentCalendarViewDTO(
                appointment.getId(),
                appointment.getBarber().getId(),
                appointment.getUser().getId(),
                appointment.getStartAppointment(),
                appointment.getEndAppointment(),
                appointment.getBarber().getName(),
                appointment.getUser().getName()
        );
    }

}
