package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Appointment;
import ro.tuc.ds2020.entities.User;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findAllByBarber(User barber);
    List<Appointment> findAllByUser(User user);
    List<Appointment> findAllByUserOrBarber(User barber, User user);

}
