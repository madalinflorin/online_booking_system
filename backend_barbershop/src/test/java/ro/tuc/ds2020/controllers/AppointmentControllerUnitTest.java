package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.AppointmentDTO;
import ro.tuc.ds2020.dtos.ServiceDTO;
import ro.tuc.ds2020.services.AppointmentService;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AppointmentControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void insertAppointment() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Integer> services_id = new ArrayList<>();
        AppointmentDTO appointmentDTO = new AppointmentDTO(1L, 1L, 2L, new Date(), new Date(), services_id, 1L, "username", "password",10);


        mockMvc.perform(post("/appointment/insert")
                .content(objectMapper.writeValueAsString(appointmentDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getAppointmentsForBarber() throws Exception {

        mockMvc.perform(get("/appointment/barber_id={barber_id}&date={date}",1, Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest")).getTime())
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getAppointmentsForUser() throws Exception {

        mockMvc.perform(get("/appointment/username={username}&token={token}","username", "token")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void deleteAppointment() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        List<Integer> services_id = new ArrayList<>();
        AppointmentDTO appointmentDTO = new AppointmentDTO(1L, 1L, 2L, new Date(), new Date(), services_id, 1L, "username", "password",10);
        mockMvc.perform(delete("/appointment/delete")
                .content(objectMapper.writeValueAsString(appointmentDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

}
