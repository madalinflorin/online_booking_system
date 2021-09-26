package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Messages;

public interface ChatRepository extends JpaRepository<Messages, Long> {

}
