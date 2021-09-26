package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.GraphicDTO;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.util.AssertionErrors.assertEquals;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-graphic.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-graphic.sql")
public class GraphicIntegrationTest extends Ds2020TestConfig {

    @Autowired
    GraphicService graphicService;

    @Test
    public void testGetCorrectGraphicForMonthAndYear() {
        List<GraphicDTO> result = new ArrayList<>();
        result.add(new GraphicDTO(1, "11-06-2021"));
        ResponseEntity<List<GraphicDTO>> list = (ResponseEntity<List<GraphicDTO>>) graphicService.getGraphicForMonthAndYear(6,2021);
        assertEquals("Test Graphic For Month And Year", result, list.getBody());
    }

    @Test
    public void testGetCorrectGraphicForYear() {
        GraphicDTO result = new GraphicDTO(new ArrayList<>(Arrays.asList(0,0,0,0,0,1,0,0,0,0,0,0)));
        ResponseEntity<GraphicDTO> list = (ResponseEntity<GraphicDTO>) graphicService.getGraphicForYear(2021);
        assertEquals("Test Graphic For Year", result, list.getBody());
    }

    @Test
    public void testGetCorrectGraphicForCountries() {
        List<GraphicDTO> result = new ArrayList<>();
        result.add(new GraphicDTO(1,"Romania"));
        ResponseEntity<List<GraphicDTO>> list = (ResponseEntity<List<GraphicDTO>>) graphicService.getGraphicForCountries();
        assertEquals("Test Graphic For Countries", result, list.getBody());
    }



    @Test
    public void testGetCorrectGraphicForStates() {
        List<GraphicDTO> result = new ArrayList<>();
        result.add(new GraphicDTO(1,"Cluj"));
        ResponseEntity<List<GraphicDTO>> list = (ResponseEntity<List<GraphicDTO>>) graphicService.getGraphicForStates();
        assertEquals("Test Graphic For States", result, list.getBody());
    }

    @Test
    public void testGetCorrectGraphicForCities() {
        List<GraphicDTO> result = new ArrayList<>();
        result.add(new GraphicDTO(1,"Cluj-Napoca"));
        ResponseEntity<List<GraphicDTO>> list = (ResponseEntity<List<GraphicDTO>>) graphicService.getGraphicForCities();
        assertEquals("Test Graphic For Cities", result, list.getBody());
    }

    @Test
    public void testGetCorrectGraphicForGender() {
        List<GraphicDTO> result = new ArrayList<>();
        result.add(new GraphicDTO(1,"M"));
        ResponseEntity<List<GraphicDTO>> list = (ResponseEntity<List<GraphicDTO>>) graphicService.getGraphicForGender();
        assertEquals("Test Graphic For Gender", result, list.getBody());
    }

}
