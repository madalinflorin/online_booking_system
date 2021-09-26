package ro.tuc.ds2020.services;


import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.SecurityConfig.jwt.JwtUtils;
import ro.tuc.ds2020.dtos.AppointmentDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.payload.request.SignupRequest;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.springframework.test.util.AssertionErrors.assertEquals;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-appointment.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-appointment.sql")
public class AppointmentIntegrationTest extends Ds2020TestConfig {

    @Autowired
    AppointmentService appointmentService;

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Test
    public void insertAppointmentAndGetAppointmentsForUserAfterAndDeleteTheAppointmentAtFinal() throws IOException {

        Set<String> roles = new HashSet<>();
        roles.add("user");
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ResponseEntity<UserDTO> insertedUser = (ResponseEntity<UserDTO>) userService.insert(userDTO);

        Date date = new Date();

        AppointmentDTO appointmentDTO = new AppointmentDTO(1L, 3L, Objects.requireNonNull(insertedUser.getBody()).getId(), new Date(date.getTime() + 60000), new Date(date.getTime() + 80000), services_id, null, "madalin", "madalin",10,"en");
        ResponseEntity<AppointmentDTO> appointmentDTOResponseEntity = (ResponseEntity<AppointmentDTO>) appointmentService.insert(appointmentDTO);
        assertEquals("Test Insert Barber id", Objects.requireNonNull(appointmentDTOResponseEntity.getBody()).getBarber_id(), appointmentDTO.getBarber_id());
        assertEquals("Test Insert User id", appointmentDTOResponseEntity.getBody().getUser_id(), appointmentDTO.getUser_id());
        assertEquals("Test Insert Start appointment", appointmentDTOResponseEntity.getBody().getStartAppointment(), appointmentDTO.getStartAppointment());
        assertEquals("Test Insert End appointment", appointmentDTOResponseEntity.getBody().getEndAppointment(), appointmentDTO.getEndAppointment());
        assertEquals("Test Insert Price", appointmentDTOResponseEntity.getBody().getEndAppointment(), appointmentDTO.getEndAppointment());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        ResponseEntity<List<AppointmentDTO>> appointmentDTOResponseEntityList = (ResponseEntity<List<AppointmentDTO>>) appointmentService.getAppointmentsForUser(userDTO.getUsername(), jwt);

        assertEquals("Test length for appointments list", 1, Objects.requireNonNull(appointmentDTOResponseEntityList.getBody()).size());

        appointmentDTO.setId(appointmentDTOResponseEntity.getBody().getId());

        appointmentService.deleteAppointment(appointmentDTO);

        appointmentDTOResponseEntityList = (ResponseEntity<List<AppointmentDTO>>) appointmentService.getAppointmentsForUser(userDTO.getUsername(), jwt);

        assertEquals("Test length for appointments list", 0, Objects.requireNonNull(appointmentDTOResponseEntityList.getBody()).size());

    }

    @Test
    public void getAppointmentsForBarber() throws ParseException {


        ResponseEntity<List<AppointmentDTO>> appointmentDTOResponseEntityList = (ResponseEntity<List<AppointmentDTO>>) appointmentService.getAppointmentsForBarber(3L, new SimpleDateFormat("yyyy-MM-dd").parse("2021-06-11"));

        assertEquals("Test length for appointments list", 1, Objects.requireNonNull(appointmentDTOResponseEntityList.getBody()).size());
    }

    @Test
    public void getAppointmentsForCalendarBarber() {


        ResponseEntity<List<AppointmentDTO>> appointmentDTOResponseEntityList = (ResponseEntity<List<AppointmentDTO>>) appointmentService.getAppointmentsForCalendarOfBarber(3L);
        assertEquals("Test length for appointments list", 1, Objects.requireNonNull(appointmentDTOResponseEntityList.getBody()).size());
    }

}
