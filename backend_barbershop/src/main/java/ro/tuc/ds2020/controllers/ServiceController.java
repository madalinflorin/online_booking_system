package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ServiceDTO;
import ro.tuc.ds2020.services.ServiceService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/service")
public class ServiceController {

    private final ServiceService serviceService;

    @Autowired
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<ServiceDTO>> getServices() {
        List<ServiceDTO> dtos = serviceService.getServices();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @PostMapping(value= "/insert")
    @PreAuthorize("hasRole('BARBER') or hasRole('ADMIN')")
    public ResponseEntity<?> insertService(@Valid @RequestBody ServiceDTO serviceDTO) {
        return serviceService.insert(serviceDTO);
    }

    @PostMapping(value= "/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@Valid @RequestBody ServiceDTO serviceDTO) {
        return serviceService.update(serviceDTO);
    }


    @GetMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getService(@PathVariable("id") long serviceId) {
        return serviceService.findServiceById(serviceId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") Long id){
        return serviceService.deleteById(id);
    }


}
