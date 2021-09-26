package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.AppointmentDTO;
import ro.tuc.ds2020.services.AppointmentService;

import javax.validation.Valid;
import java.util.Date;

@RestController
@CrossOrigin
@RequestMapping(value = "/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping(value = "/insert")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> insert(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.insert(appointmentDTO);
    }

    @PostMapping(value = "/edit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> edit(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.edit(appointmentDTO);
    }

    @GetMapping(value = "/barber_id={barber_id}&date={date}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAppointmentsForBarber(@PathVariable("barber_id") long barber_id, @PathVariable("date") Date date) {
        return appointmentService.getAppointmentsForBarber(barber_id,date);
    }

    @GetMapping(value = "/username={username}&token={token}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAppointmentsForUser(@PathVariable("username") String username, @PathVariable("token") String token) {
        return appointmentService.getAppointmentsForUser(username, token);
    }

    @DeleteMapping(value = "/delete")
    @PreAuthorize("hasRole('USER') or hasRole('BARBER')")
    public ResponseEntity<?> deleteAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.deleteAppointment(appointmentDTO);
    }

}
