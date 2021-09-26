package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import ro.tuc.ds2020.dtos.ServiceDTO;
import ro.tuc.ds2020.dtos.builders.ServiceBuilder;
import ro.tuc.ds2020.entities.Services;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.ServiceRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceService.class);
    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceDTO> getServices() {
        List<Services> services = serviceRepository.findAll();
        return services.stream()
                .map(ServiceBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> findServiceById(long id) {
        Optional<Services> service = serviceRepository.findById(id);
        if (!service.isPresent()) {
            LOGGER.debug("Service with id: {} was not found in db!", id);
            return ResponseEntity.badRequest().body(new MessageResponse("Service with id: " + id + " was not found in db!"));
        }
        return ResponseEntity.ok().body(ServiceBuilder.toDTO(service.get()));
    }

    public ResponseEntity<?> insert(ServiceDTO serviceDTO) {
        Services service = ServiceBuilder.toEntity(serviceDTO);
        service = serviceRepository.save(service);
        LOGGER.debug("Service with id {} was inserted in db", service.getId());
        return ResponseEntity.ok().body(ServiceBuilder.toDTO(service));
    }


    public ResponseEntity<?> update(ServiceDTO serviceDTO) {

        Optional<Services> service = serviceRepository.findById(serviceDTO.getId());
        if(!service.isPresent()){
            LOGGER.debug("Service with id: {} was not found in db!", serviceDTO.getId());
            return ResponseEntity.badRequest().body(new MessageResponse("Service with id: " + serviceDTO.getId() + " was not found in db!"));
        }

        Services service_entity = ServiceBuilder.toEntityWithId(serviceDTO);
        service_entity = serviceRepository.save(service_entity);
        return ResponseEntity.ok().body(ServiceBuilder.toDTO(service_entity));
    }


    public ResponseEntity<?> deleteById(Long id){
        Optional<Services> service = serviceRepository.findById(id);
        if(!service.isPresent()){
            LOGGER.debug("Service with id: {} was not found in db!", id);
            return ResponseEntity.badRequest().body(new MessageResponse("Service with id: " + id + " was not found in db!"));
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok().body(new MessageResponse("Service with id: " + id + " was deleted!"));
    }

}
