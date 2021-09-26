package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ProgramViewDTO;
import ro.tuc.ds2020.services.ProgramService;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/program")
public class ProgramController {

    private final ProgramService programService;

    @Autowired
    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    @GetMapping()
    public ResponseEntity<List<ProgramViewDTO>> getProgram() {
        List<ProgramViewDTO> programs = programService.getProgram();
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @GetMapping(value = "/user_id={user_id}&day={day}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProgramForBarber(@PathVariable("user_id") long user_id,@PathVariable("day") int day) {
        return programService.getProgramForBarber(user_id, day);
    }

    @GetMapping(value = "/all/user_id={user_id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAllProgramsForBarber(@PathVariable("user_id") long user_id) {
        return programService.getAllProgramsForBarber(user_id);
    }

}
