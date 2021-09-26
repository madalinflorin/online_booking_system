package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.ProgramDTO;
import ro.tuc.ds2020.dtos.ProgramViewDTO;

import static org.springframework.test.util.AssertionErrors.assertEquals;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-program.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-program.sql")
public class ProgramIntegrationTest extends Ds2020TestConfig {

    @Autowired
    ProgramService programService;

    @Test
    public void testGetProgramCorrect() {
        List<ProgramViewDTO> result = new ArrayList<>();
        result.add(new ProgramViewDTO(1, "7:00-14:00"));
        result.add(new ProgramViewDTO(2, "9:00-14:00"));
        List<ProgramViewDTO> programViewDTOS = programService.getProgram();
        assertEquals("Test program", programViewDTOS, result);
    }

    @Test
    public void testGetProgramForBarberForASpecificDay() throws ParseException {
        ProgramDTO result = new ProgramDTO(1L, 1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 09:00:56.745"),new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 14:00:56.745"),1L);
        ProgramDTO programDTO = (ProgramDTO) programService.getProgramForBarber(1,1).getBody();
        assertEquals("Test id", Objects.requireNonNull(programDTO).getId(), result.getId());
        assertEquals("Test user_id", programDTO.getUser_id(), result.getUser_id());
        assertEquals("Test start program",programDTO.getStartProgram().getTime(), result.getStartProgram().getTime());
        assertEquals("Test end program", programDTO.getEndProgram().getTime(), result.getEndProgram().getTime());
    }

    @Test
    public void testGetProgramForBarberOnEveryDay() throws ParseException {
        List<ProgramDTO> result = new ArrayList<>();
        result.add(new ProgramDTO(1L, 1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 09:00:56.745"),new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 14:00:56.745"),1L));
        result.add(new ProgramDTO(2L, 2,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 09:00:56.745"),new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("2021-06-09 14:00:56.745"),1L));
        ResponseEntity<List<ProgramDTO>> programDTO = (ResponseEntity<List<ProgramDTO>>) programService.getAllProgramsForBarber(1);
        for(int i=0;i<result.size();i++){
            assertEquals("Test id", result.get(i).getId(), Objects.requireNonNull(programDTO.getBody()).get(i).getId());
            assertEquals("Test day", result.get(i).getDay(), programDTO.getBody().get(i).getDay());
            assertEquals("Test start program", result.get(i).getStartProgram().getTime(), programDTO.getBody().get(i).getStartProgram().getTime());
            assertEquals("Test end program", result.get(i).getEndProgram().getTime(), programDTO.getBody().get(i).getEndProgram().getTime());
            assertEquals("Test user id", result.get(i).getUser_id(), programDTO.getBody().get(i).getUser_id());
        }
    }


}

