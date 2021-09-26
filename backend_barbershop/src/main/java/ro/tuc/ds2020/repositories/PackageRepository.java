package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.PackagePromotional;
import java.util.Optional;

public interface PackageRepository extends JpaRepository<PackagePromotional, Long> {

    Optional<PackagePromotional> findById(long id);

}
