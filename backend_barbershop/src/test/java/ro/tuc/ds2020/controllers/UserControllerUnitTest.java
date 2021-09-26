package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.payload.request.ChangePasswordRequest;
import ro.tuc.ds2020.payload.request.ContactRequest;
import ro.tuc.ds2020.payload.request.ResetPasswordRequest;
import ro.tuc.ds2020.payload.request.SignupRequest;
import ro.tuc.ds2020.services.UserService;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UserControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getUsers() throws Exception {

        mockMvc.perform(get("/user/users")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getUser() throws Exception {

        mockMvc.perform(get("/user/profile/username={username}&token={token}", "madalin", "token")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getUserById() throws Exception {

        mockMvc.perform(get("/user/{id}", 1)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getBarbers() throws Exception {

        mockMvc.perform(get("/user/barbers")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getBarbersPublic() throws Exception {

        mockMvc.perform(get("/user/public/barbers")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getAdmins() throws Exception {

        mockMvc.perform(get("/user/admins")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void updateUser() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/update")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getActivate() throws Exception {

        mockMvc.perform(post("/user/activate")
                .content("token")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void resetPassword() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ResetPasswordRequest request = new ResetPasswordRequest("email", "subject","message");

        mockMvc.perform(post("/user/resetPassword")
                .content(objectMapper.writeValueAsString(request))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void changePassword() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ChangePasswordRequest request = new ChangePasswordRequest("password","password_confirmation", "token");

        mockMvc.perform(post("/user/changePassword")
                .content(objectMapper.writeValueAsString(request))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void tokenPassword() throws Exception {


        mockMvc.perform(post("/user/tokenPassword")
                .content("token")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void contactUser() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ContactRequest contactRequest  = new ContactRequest("name","email@gmail.com","telephone","message","language");

        mockMvc.perform(post("/user/contact")
                .content(objectMapper.writeValueAsString(contactRequest))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUser() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void deleteUser() throws Exception {


        mockMvc.perform(delete("/user/delete/{id}", 1)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongLengthForUsername() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"ma","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongFormatForEmail() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForAllPasswords() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madal","madal","madal","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForName() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","ma",new Date(),'M',"country","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForCountry() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"123456789012345678901234567890123456789012345678901234567890","state","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForState() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","123456789012345678901234567890123456789012345678901234567890","city","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }



    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForCity() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","123456789012345678901234567890123456789012345678901234567890012345678901234567890012345678901234567890012345678901234567890","photo", roles, "subject","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForSubject() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "1234567890123456789012345678901234567890123456789012345678901234567890","message", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertUserWithWrongSizeForMessage() throws Exception {

        Set<String> roles = new HashSet<>();
        List<Integer> days_id = new ArrayList<>();
        List<Date> start_id = new ArrayList<>();
        List<Date> end_id = new ArrayList();
        List<Integer> services_id = new ArrayList<>();
        List<Integer> packages_id = new ArrayList<>();
        SignupRequest userDTO = new SignupRequest(1L,"madalin","madalin@gmail.com","madalin","madalin","madalin","madalin",new Date(),'M',"country","state","city","photo", roles, "subject","123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", days_id, start_id, end_id, services_id, packages_id);
        ObjectMapper objectMapper = new ObjectMapper();
        mockMvc.perform(post("/user/insert")
                .content(objectMapper.writeValueAsString(userDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }


}
