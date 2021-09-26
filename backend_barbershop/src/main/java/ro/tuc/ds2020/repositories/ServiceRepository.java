package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Services;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Services, Long> {

    Optional<Services> findById(long id);
}
