package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Program;
import ro.tuc.ds2020.entities.User;

import java.util.List;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    Optional<Program> findByDayAndUser(int day, User user);

    List<Program> findAllByUser(User user);


}
