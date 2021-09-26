package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.BarberDTO;
import ro.tuc.ds2020.dtos.BarberViewDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.payload.request.ChangePasswordRequest;
import ro.tuc.ds2020.payload.request.ContactRequest;
import ro.tuc.ds2020.payload.request.ResetPasswordRequest;
import ro.tuc.ds2020.payload.request.SignupRequest;
import ro.tuc.ds2020.services.UserService;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping(value = "/profile/username={username}&token={token}")
    @PreAuthorize("hasRole('USER') or hasRole('BARBER') or hasRole('ADMIN')")

    public ResponseEntity<?> getUser(@PathVariable("username") String username,@PathVariable("token") String token ) {

        return  userService.findUserByUsername(username, token);

    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<?> getUserById(@PathVariable("id") long id) {

        return  userService.findUserById(id);

    }

    @PostMapping(value = "/update")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<?> updateUser(@Valid @RequestBody SignupRequest request) {

        return userService.updateUser(request);

    }

    @PostMapping(value = "/update_profile")
    @PreAuthorize("hasRole('USER') or hasRole('BARBER') or hasRole('ADMIN')")

    public ResponseEntity<?> updateProfile(@Valid @RequestBody SignupRequest request) {

        return userService.updateProfile(request);

    }

    @PostMapping(value = "/activate")
    public ResponseEntity<?> activateAccount(@RequestBody String token) {
        return userService.activateAccount(token);
    }

    @PostMapping(value = "/resetPassword")
    public ResponseEntity<?>  resetPassword(@RequestBody ResetPasswordRequest request) {
        return userService.resetPassword(request);
    }

    @PostMapping(value = "/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return userService.changePassword(request);
    }

    @PostMapping(value = "/tokenPassword")
    public ResponseEntity<?> verifyToken(@RequestBody String token) {
        return userService.verifyToken(token);
    }

    @PostMapping(value = "/contact")
    public ResponseEntity<?> contactMessage(@RequestBody ContactRequest request) {
        return userService.contactMessage(request);
    }


    @GetMapping(value = "/public/barbers")
    public ResponseEntity<List<BarberViewDTO>> getBarbersForPublicPage() {
        List<BarberViewDTO> dtos = userService.getBarbersForPublicPage();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtos = userService.getUsers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }


    @GetMapping(value = "/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAdmins() {
        List<UserDTO> dtos = userService.getAdmins();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/barbers")
    public ResponseEntity<List<BarberDTO>> getBarbers() {
        List<BarberDTO> dtos = userService.getBarbers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(value = "/insert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> insert(@Valid @RequestBody SignupRequest request) throws IOException {
        return userService.insert(request);
    }

    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        return userService.delete(id);
    }

}
