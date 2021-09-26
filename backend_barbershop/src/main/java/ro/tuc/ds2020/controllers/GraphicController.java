package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.services.GraphicService;

@RestController
@CrossOrigin
@RequestMapping(value = "/graphic")
public class GraphicController {

    private final GraphicService graphicService;

    @Autowired
    public GraphicController(GraphicService graphicService) {
        this.graphicService = graphicService;
    }

    @GetMapping(value = "/month={month}&year={year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForMonthAndYear(@PathVariable("month") int month, @PathVariable("year") int year) {
        return graphicService.getGraphicForMonthAndYear(month,year);
    }


    @GetMapping(value = "/year={year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForYear(@PathVariable("year") int year) {
        return graphicService.getGraphicForYear(year);
    }

    @GetMapping(value = "/countries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForCountries() {
        return graphicService.getGraphicForCountries();
    }

    @GetMapping(value = "/states")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForStates() {
        return graphicService.getGraphicForStates();
    }

    @GetMapping(value = "/cities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForCities() {
        return graphicService.getGraphicForCities();
    }

    @GetMapping(value = "/gender")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGraphicForGender() {
        return graphicService.getGraphicForGender();
    }


}
