package ro.tuc.ds2020.controllers;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ProgramControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProgramController programController;


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getProgram() throws Exception {

        mockMvc.perform(get("/program")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getProgramForBarber() throws Exception {

        mockMvc.perform(get("/program/user_id={user_id}&day={day}",1,1)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getProgramForAllBarbers() throws Exception {

        mockMvc.perform(get("/program/all/user_id={user_id}",1)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

}
