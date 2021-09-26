package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.PackageDTO;
import ro.tuc.ds2020.dtos.builders.PackageBuilder;
import ro.tuc.ds2020.entities.PackagePromotional;
import ro.tuc.ds2020.entities.Services;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.PackageRepository;
import ro.tuc.ds2020.repositories.ServiceRepository;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PackageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PackageService.class);
    private final PackageRepository packageRepository;
    private final ServiceRepository serviceRepository;

    @Autowired
    public PackageService(PackageRepository packageRepository, ServiceRepository serviceRepository) {

        this.packageRepository = packageRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<PackageDTO> getPackages() {
        List<PackagePromotional> packages = packageRepository.findAll();
        return packages.stream()
                .map(PackageBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public List<PackageDTO> getPackages1() {
        List<PackagePromotional> packages = packageRepository.findAll();
        return packages.stream()
                .filter(this::isPackageExpired)
                .map(PackageBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> findPackageById(long id) {
        Optional<PackagePromotional> packagePromotional = packageRepository.findById(id);
        if (!packagePromotional.isPresent()) {
            LOGGER.debug("Package with id {} was not found in db!", id);
            return ResponseEntity.badRequest().body(new MessageResponse("Package with id: " + id + " was not found in db!"));
        }
        return ResponseEntity.ok().body(PackageBuilder.toDTO(packagePromotional.get()));
    }

    private long create_package(PackageDTO packageDTO) {
        if(packageDTO.getStartValidityPeriod().after(packageDTO.getEndValidityPeriod())){
            return -1;
        }
        if(packageDTO.getStartDiscountPeriod().after(packageDTO.getEndDiscountPeriod())){
            return -1;
        }

        if(packageDTO.getStartDiscountPeriod().before(packageDTO.getStartValidityPeriod()) ||
                packageDTO.getEndDiscountPeriod().after(packageDTO.getEndValidityPeriod())){
            return -1;
        }

        PackagePromotional packagePromotional = PackageBuilder.toEntity(packageDTO);
        packagePromotional = packageRepository.save(packagePromotional);
        return packagePromotional.getId();
    }

    public ResponseEntity<?> insert(PackageDTO packageDTO) {

        long idPackage = create_package(packageDTO);

        if(idPackage== -1){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Either the discount period is not included in the validity period, or the ends of the 2 intervals are not in ascending order!"));
        }

        Optional<PackagePromotional> packagePromotional = packageRepository.findById(idPackage);
        List<Integer> services = packageDTO.getServices_id();
        if (packagePromotional.isPresent()) {
            for (Integer service : services) {

                Optional<Services> p = serviceRepository.findById(service);

                if (p.isPresent()) {
                    packagePromotional.get().getServices().add(p.get());
                    p.get().getPackages().add(packagePromotional.get());
                    serviceRepository.save(p.get());
                } else {
                    LOGGER.debug("Service with id: {} do not exists!", service);
                    return ResponseEntity.status(402).body(new MessageResponse("Service with id: " + service + " do not exists!"));
                }

            }

            packageRepository.save(packagePromotional.get());

            return ResponseEntity.ok().body(PackageBuilder.toDTO(packagePromotional.get()));

        }

        LOGGER.debug("Error at created package!");
        return ResponseEntity.badRequest().body(new MessageResponse("Error at created package!"));

    }

    public ResponseEntity<?> update(PackageDTO packageDTO){
        Optional<PackagePromotional> packagePromotional = packageRepository.findById(packageDTO.getId());
        List<Integer> services = packageDTO.getServices_id();
        if (packagePromotional.isPresent()) {
            PackagePromotional promotional = packagePromotional.get();
            promotional.getServices().clear();

            for (Integer service : services) {

                Optional<Services> p = serviceRepository.findById(service);

                if (p.isPresent()) {
                    promotional.getServices().add(p.get());
                    p.get().getPackages().add(promotional);
                    serviceRepository.save(p.get());
                } else {
                    LOGGER.debug("Service with id: {}do not exists!", service);
                    return ResponseEntity.status(401).body(new MessageResponse("Service with id: " + service + " do not exists!"));
                }

            }

            promotional.setNameRo(packageDTO.getNameRo());
            promotional.setNameEn(packageDTO.getNameEn());
            promotional.setStartValidityPeriod(packageDTO.getStartValidityPeriod());
            promotional.setEndValidityPeriod(packageDTO.getEndValidityPeriod());
            promotional.setDiscount(packageDTO.getDiscount());
            promotional.setStartDiscountPeriod(packageDTO.getStartDiscountPeriod());
            promotional.setEndDiscountPeriod(packageDTO.getEndDiscountPeriod());
            packageRepository.save(promotional);
            return ResponseEntity.ok().body(PackageBuilder.toDTO(promotional));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Package not found!"));
    }


    public ResponseEntity<?> deleteById(Long id) {
        Optional<PackagePromotional> packagePromotional = packageRepository.findById(id);
        if (!packagePromotional.isPresent()) {
            LOGGER.debug("Package with id: {} was not found in db!",id);
            return ResponseEntity.badRequest().body(new MessageResponse("Package with id: " + id + " was not found in db!"));
        }
        packageRepository.deleteById(id);
        return ResponseEntity.ok().body(new MessageResponse("Package with id: " + id + " was deleted!"));
    }

    private boolean isPackageExpired(PackagePromotional packagePromotional) {
        final Calendar cal = Calendar.getInstance();
        return packagePromotional.getStartValidityPeriod().before(cal.getTime()) && packagePromotional.getEndValidityPeriod().after(cal.getTime());
    }

}
