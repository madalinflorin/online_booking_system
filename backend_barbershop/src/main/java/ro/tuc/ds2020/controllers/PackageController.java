package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PackageDTO;
import ro.tuc.ds2020.services.PackageService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/package")
public class PackageController {

    private final PackageService packageService;

    @Autowired
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<PackageDTO>> getPackages() {

        List<PackageDTO> dtos = packageService.getPackages();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/public/all")
    public ResponseEntity<List<PackageDTO>> getPackages1() {

        List<PackageDTO> dtos = packageService.getPackages1();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @PostMapping(value= "/insert")
    @PreAuthorize("hasRole('BARBER') or hasRole('ADMIN')")
    public ResponseEntity<?> insertPackage(@Valid @RequestBody PackageDTO packageDTO) {
        return packageService.insert(packageDTO);
    }

    @PostMapping(value = "/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@Valid @RequestBody PackageDTO packageDTO){
        return packageService.update(packageDTO);
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPackage(@PathVariable("id") long packageId) {
        return packageService.findPackageById(packageId);
    }



    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteById(@PathVariable("id") long id){
        return packageService.deleteById(id);
    }
}
