package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.entities.ActivationToken;
import ro.tuc.ds2020.entities.User;

@Repository
public interface ActivationTokenRepository extends JpaRepository<ActivationToken, Long> {

    ActivationToken findByToken(String token);


    Boolean existsByToken(String token);

    @Transactional
    void deleteByToken(String token);

    @Transactional
    void deleteAllByUser(User user);

}
