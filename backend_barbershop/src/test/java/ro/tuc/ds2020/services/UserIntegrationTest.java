package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.BarberDTO;
import ro.tuc.ds2020.dtos.BarberViewDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.payload.request.ChangePasswordRequest;
import ro.tuc.ds2020.payload.request.ResetPasswordRequest;
import ro.tuc.ds2020.payload.request.SignupRequest;
import ro.tuc.ds2020.repositories.ActivationTokenRepository;
import ro.tuc.ds2020.repositories.PasswordResetRepository;

import java.io.IOException;
import java.util.*;

import static org.springframework.test.util.AssertionErrors.assertEquals;
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-users.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-users.sql")

public class UserIntegrationTest extends Ds2020TestConfig {

    @Autowired
    UserService userService;

    @Autowired
    ActivationTokenRepository activationTokenRepository;

    @Autowired
    PasswordResetRepository passwordResetRepository;

    @Test
    public void testGetCorrectAdmins() {
        List<UserDTO> admins = userService.getAdmins();
        assertEquals("Test Insert Admins", 1, admins.size());
    }

    @Test
    public void testGetCorrectUsers() {
        List<UserDTO> users = userService.getAdmins();
        assertEquals("Test Insert Users", 1, users.size());
    }

    @Test
    public void testGetCorrectBarbers() {
        List<BarberDTO> barberDTOS = userService.getBarbers();
        assertEquals("Test Insert Barbers", 1, barberDTOS.size());
    }

    @Test
    public void testGetCorrectBarbersPublic() {
        List<BarberViewDTO> barberViewDTOS = userService.getBarbersForPublicPage();
        assertEquals("Test Insert Barbers Public", 1, barberViewDTOS.size());
    }


    @Test
    public void testInsertCorrectWithGetByIdForUsersAndAdminsAndUpdateAfter() throws IOException {
        Set<String> roles = new HashSet<>();
        roles.add("user");
        roles.add("admin");
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ResponseEntity<UserDTO> insertedUser = (ResponseEntity<UserDTO>) userService.insert(userDTO);

        ResponseEntity<BarberDTO> fetchedUser = (ResponseEntity<BarberDTO>) userService.findUserById(Objects.requireNonNull(insertedUser.getBody()).getId());

        assertEquals("Test nr. activation codes", activationTokenRepository.findAll().size(), 1);
        assertEquals("Test Inserted User Username", Objects.requireNonNull(fetchedUser.getBody()).getUsername(), insertedUser.getBody().getUsername());
        assertEquals("Test Inserted User Country", fetchedUser.getBody().getCountry(), insertedUser.getBody().getCountry());
        assertEquals("Test Inserted User State", fetchedUser.getBody().getState(), insertedUser.getBody().getState());
        assertEquals("Test Inserted User City", fetchedUser.getBody().getCity(), insertedUser.getBody().getCity());
        assertEquals("Test Inserted User Email", fetchedUser.getBody().getName(), insertedUser.getBody().getName());
        assertEquals("Test Inserted User Name", fetchedUser.getBody().getEmail(), insertedUser.getBody().getEmail());
        assertEquals("Test Inserted User Birthday", fetchedUser.getBody().getBirthDate().getTime(), insertedUser.getBody().getBirthDate().getTime());
        assertEquals("Test Inserted User Gender", fetchedUser.getBody().getGender(), insertedUser.getBody().getGender());

        insertedUser = (ResponseEntity<UserDTO>) userService.updateProfile(userDTO);

        fetchedUser = (ResponseEntity<BarberDTO>) userService.findUserById(Objects.requireNonNull(insertedUser.getBody()).getId());

        Objects.requireNonNull(fetchedUser.getBody()).setBirthDate(insertedUser.getBody().getBirthDate());

        assertEquals("Test Inserted User Username", fetchedUser.getBody().getUsername(), insertedUser.getBody().getUsername());
        assertEquals("Test Inserted User Country", fetchedUser.getBody().getCountry(), insertedUser.getBody().getCountry());
        assertEquals("Test Inserted User State", fetchedUser.getBody().getState(), insertedUser.getBody().getState());
        assertEquals("Test Inserted User City", fetchedUser.getBody().getCity(), insertedUser.getBody().getCity());
        assertEquals("Test Inserted User Email", fetchedUser.getBody().getName(), insertedUser.getBody().getName());
        assertEquals("Test Inserted User Name", fetchedUser.getBody().getEmail(), insertedUser.getBody().getEmail());
        assertEquals("Test Inserted User Birthday", fetchedUser.getBody().getBirthDate().getTime(), insertedUser.getBody().getBirthDate().getTime());
        assertEquals("Test Inserted User Gender", fetchedUser.getBody().getGender(), insertedUser.getBody().getGender());

    }

    @Test
    public void testInsertCorrectWithGetByIdForBarbers() throws IOException {
        Set<String> roles = new HashSet<>();
        roles.add("barber");
        List<Integer> days_id = new ArrayList<>();
        days_id.add(1);
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        Date date = new Date();
        start_id.add(date);
        end_id.add(date);
        List<Integer> services_id = new ArrayList<>();
        services_id.add(20);
        services_id.add(21);
        List<Integer> packages_id = new ArrayList<>();
        packages_id.add(7);
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ResponseEntity<BarberDTO> insertedUser = (ResponseEntity<BarberDTO>) userService.insert(userDTO);

        ResponseEntity<BarberDTO> fetchedUser = (ResponseEntity<BarberDTO>) userService.findUserById(Objects.requireNonNull(insertedUser.getBody()).getId());

        Objects.requireNonNull(fetchedUser.getBody()).setBirthDate(insertedUser.getBody().getBirthDate());

        assertEquals("Test nr. activation codes", activationTokenRepository.findAll().size(), 1);
        assertEquals("Test Inserted Barber", fetchedUser, insertedUser);
    }

    @Test
    public void updateUser() {
        Set<String> roles = new HashSet<>();
        roles.add("barber");
        List<Integer> days_id = new ArrayList<>();
        days_id.add(1);
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        Date date = new Date();
        start_id.add(date);
        end_id.add(date);
        List<Integer> services_id = new ArrayList<>();
        services_id.add(20);
        services_id.add(21);
        List<Integer> packages_id = new ArrayList<>();
        packages_id.add(7);
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ResponseEntity<BarberDTO> insertedUser = (ResponseEntity<BarberDTO>) userService.updateUser(userDTO);

        ResponseEntity<BarberDTO> fetchedUser = (ResponseEntity<BarberDTO>) userService.findUserById(userDTO.getId());

        Objects.requireNonNull(fetchedUser.getBody()).setBirthDate(Objects.requireNonNull(insertedUser.getBody()).getBirthDate());

        assertEquals("Test Inserted Barber", fetchedUser, insertedUser);
    }



    @Test
    public void testInsertCorrectWithGetAllForBarber() throws IOException {
        Set<String> roles = new HashSet<>();
        roles.add("barber");
        List<Integer> days_id = new ArrayList<>();
        days_id.add(1);
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        Date date = new Date();
        start_id.add(date);
        end_id.add(date);
        List<Integer> services_id = new ArrayList<>();
        services_id.add(20);
        services_id.add(21);
        List<Integer> packages_id = new ArrayList<>();
        packages_id.add(7);
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        userService.insert(userDTO);

        List<BarberDTO> barbers = userService.getBarbers();
        assertEquals("Test Inserted Barbers", 2, barbers.size());
    }


    @Test
    public void testInsertCorrectWithGetAllForAdminAndUser() throws IOException {
        Set<String> roles = new HashSet<>();
        roles.add("user");
        roles.add("admin");
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList<>();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","ardeleanumadalinf@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrMCvc6/38XzxAAAAYC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAAAAAAAAAAAAAAAAPsagz4V4rq/FmCLTj/k4vYqgCN5/TKfjlcAJKff5pJ5QPH6Y77YBiz6a4thQJ30D03VKmB3+qfcbhOwO+l+waP/+VsEBgDV6USumgNMOtVkDbDoZIstQNHpiimA1+m8JUBSQ8kO4HBqyB1mAElNJTMAr6a8FcCmxjYjgKjGohGAU2POBmBXc7sJwKrmVhOAqOaiCUBQc8EEQO0JwPMB4ADASwhAe3yR8VPiP3/M8XOaPzQd/lLyp56xSuvnUGK0yHC313idCw6umNov+bhm5aK7fdWAZQ/WbdoXnlg5Y+mvfe2SxVdWj20FAAAAAAAAAAAAwFQAAJSS0hwmfVMIc0qlmAfsOQWvP+RDyrtNQM1L0D8WllxNAWqOXifzMVcbgG3xaswv22jAFp3a6zFteYw8fQ9DM6Amr275VG8GlFmdm8uNgDzpgqZ8EyB7XZTPNwDKpAubysWAOuvi5nolYHW6PLdeBjiCbikc1wCK0025cgUg68Zyf0DUrcXegKibi30Bq25v7QnYNKCtH+BwGpA7ugFmDWnuBSgaVOkECBpU6AOoGlbtAlg1rLULIGhYoQvAaViuC0AD6wE4Xh1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA194CuqC6onikxXwAAAAASUVORK5CYII=", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        userService.insert(userDTO);

        List<UserDTO> users = userService.getUsers();
        List<UserDTO> admins = userService.getAdmins();
        assertEquals("Test Inserted Users", 2, users.size());
        assertEquals("Test Inserted Admins", 2, admins.size());
    }

    @Test
    public void testDeleteCorrectWithGetAllForUsers() {
        userService.delete(1L);

        List<UserDTO> userDTOS = userService.getUsers();
        assertEquals("Test Inserted Services", userDTOS.size(), 0);
    }


    @Test
    public void testDeleteCorrectWithGetAllForAdmins() {
        userService.delete(3L);

        List<UserDTO> userDTOS = userService.getAdmins();
        assertEquals("Test Inserted Services", userDTOS.size(), 0);
    }

    @Test
    public void testDeleteCorrectWithGetAllForBarbers() {
        userService.delete(2L);

        List<BarberDTO> userDTOS = userService.getBarbers();
        assertEquals("Test Inserted Services", userDTOS.size(), 0);
    }

    @Test
    public void testResetPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest("getfit98@gmail.com","subject","message");
        userService.resetPassword(request);
        assertEquals("Test nr. tokens for reset password",1, passwordResetRepository.findAll().size());
        String token = passwordResetRepository.findAll().get(0).getToken();

        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest("newpassword","newpassword",token);

        userService.changePassword(changePasswordRequest);

        assertEquals("Test nr. tokens for reset password after the change of the password", 0, passwordResetRepository.findAll().size());
    }

}
