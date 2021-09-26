package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.GraphicDTO;
import ro.tuc.ds2020.entities.Appointment;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.repositories.AppointmentRepository;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class GraphicService {
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public GraphicService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public ResponseEntity<?> getGraphicForMonthAndYear(int month,int year){

        List<Appointment> appointments = appointmentRepository.findAll();
        List<GraphicDTO> graphicDTOS = new ArrayList<>();

        HashMap<String, Integer> result = new HashMap<>();

        DateFormat formatter= new SimpleDateFormat("dd-MM-yyyy");
        formatter.setTimeZone(TimeZone.getTimeZone("Europe/Bucharest"));

        for(Appointment a : appointments){
            Date date = a.getStartAppointment();
            Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            cal.setTime(date);
            int yearAppointment = cal.get(Calendar.YEAR);
            int monthAppointment = cal.get(Calendar.MONTH) + 1;
            String dateString = formatter.format(date);
            if(year==yearAppointment && month == monthAppointment){
                if(result.get(dateString)==null){
                    result.put(dateString, 1);
                }
                else {
                    result.put(dateString, result.get(dateString) + 1);
                }
            }
        }

        for(String date: result.keySet()){
            graphicDTOS.add(new GraphicDTO(result.get(date),date));
        }

        return ResponseEntity.ok().body(graphicDTOS);
    }

    public ResponseEntity<?> getGraphicForYear(int year){

        List<Appointment> appointments = appointmentRepository.findAll();

        List<Integer> months_counter = new ArrayList<>(Arrays.asList(0,0,0,0,0,0,0,0,0,0,0,0));

        DateFormat formatter= new SimpleDateFormat("dd-MM-yyyy");
        formatter.setTimeZone(TimeZone.getTimeZone("Europe/Bucharest"));

        for(Appointment a : appointments){
            Date date = a.getStartAppointment();
            Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            cal.setTime(date);
            int yearAppointment = cal.get(Calendar.YEAR);
            int monthAppointment = cal.get(Calendar.MONTH);

            if(year==yearAppointment){
                months_counter.set(monthAppointment, months_counter.get(monthAppointment) + 1);
            }
        }


        return ResponseEntity.ok().body(new GraphicDTO(months_counter));
    }

    public ResponseEntity<?> getGraphicForCountries(){

        List<Appointment> appointments = appointmentRepository.findAll();

        List<GraphicDTO> result = new ArrayList<>();

        HashMap<String, Integer> countries = new HashMap<>();

        HashMap<String, Integer> evidenceUsers = new HashMap<>();

        for(Appointment a : appointments){

            User user = a.getUser();

            if(countries.get(user.getCountry()) == null){
                countries.put(user.getCountry(), 1);
                evidenceUsers.put(user.getUsername(), 1);
            }
            else {

                if(evidenceUsers.get(user.getUsername()) == null) {
                    countries.put(user.getCountry(), countries.get(user.getCountry()) + 1);
                    evidenceUsers.put(user.getUsername(), 1);
                }
            }

        }

        for(String country: countries.keySet()){
            result.add(new GraphicDTO(countries.get(country),country));
        }

        return ResponseEntity.ok().body(result);
    }

    public ResponseEntity<?> getGraphicForStates(){

        List<Appointment> appointments = appointmentRepository.findAll();

        List<GraphicDTO> result = new ArrayList<>();

        HashMap<String, Integer> states = new HashMap<>();

        HashMap<String, Integer> evidenceUsers = new HashMap<>();

        for(Appointment a : appointments){

            User user = a.getUser();

            if(states.get(user.getState())==null){
                states.put(user.getState(), 1);
                evidenceUsers.put(user.getUsername(), 1);
            }
            else {
                if(evidenceUsers.get(user.getUsername())==null) {
                    states.put(user.getState(), states.get(user.getState()) + 1);
                    evidenceUsers.put(user.getUsername(), 1);
                }
            }

        }

        for(String state: states.keySet()){
            result.add(new GraphicDTO(states.get(state),state));
        }

        return ResponseEntity.ok().body(result);
    }

    public ResponseEntity<?> getGraphicForCities(){

        List<Appointment> appointments = appointmentRepository.findAll();

        List<GraphicDTO> result = new ArrayList<>();

        HashMap<String, Integer> cities = new HashMap<>();

        HashMap<String, Integer> evidenceUsers = new HashMap<>();

        for(Appointment a : appointments){

            User user = a.getUser();

            if(cities.get(user.getCity())==null){
                cities.put(user.getCity(), 1);
                evidenceUsers.put(user.getUsername(), 1);
            }
            else {
                if(!user.getCity().equals("None") && evidenceUsers.get(user.getUsername())==null) {
                    cities.put(user.getCity(), cities.get(user.getCity()) + 1);
                    evidenceUsers.put(user.getUsername(), 1);
                }
            }

        }

        for(String city: cities.keySet()){
            result.add(new GraphicDTO(cities.get(city),city));
        }

        return ResponseEntity.ok().body(result);
    }

    public ResponseEntity<?> getGraphicForGender(){

        List<Appointment> appointments = appointmentRepository.findAll();

        List<GraphicDTO> result = new ArrayList<>();

        HashMap<Character, Integer> gender = new HashMap<>();

        HashMap<String, Integer> evidenceUsers = new HashMap<>();

        for(Appointment a : appointments){

            User user = a.getUser();

            if(gender.get(user.getGender())==null){
                gender.put(user.getGender(), 1);
                evidenceUsers.put(user.getUsername(), 1);
            }
            else {
                    if(evidenceUsers.get(user.getUsername())==null) {
                        gender.put(user.getGender(), gender.get(user.getGender()) + 1);
                        evidenceUsers.put(user.getUsername(), 1);
                    }
            }

        }

        for(char g: gender.keySet()){
            result.add(new GraphicDTO(gender.get(g),g+""));
        }

        return ResponseEntity.ok().body(result);
    }

}
