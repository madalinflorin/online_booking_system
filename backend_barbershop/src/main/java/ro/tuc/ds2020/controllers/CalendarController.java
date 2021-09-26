package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.services.AppointmentService;

@RestController
@CrossOrigin
@RequestMapping(value = "/calendar")
public class CalendarController {

    private final AppointmentService appointmentService;

    @Autowired
    public CalendarController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping(value = "/barber_id={barber_id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BARBER') or hasRole('USER')")
    public ResponseEntity<?> getAppointmentsForBarber(@PathVariable("barber_id") long barber_id) {
        return appointmentService.getAppointmentsForCalendarOfBarber(barber_id);
    }

}
