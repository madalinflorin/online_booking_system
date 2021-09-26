package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.ProgramViewDTO;
import ro.tuc.ds2020.dtos.builders.ProgramBuilder;
import ro.tuc.ds2020.entities.*;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.ProgramRepository;
import ro.tuc.ds2020.repositories.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgramService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProgramService.class);
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgramService(ProgramRepository programRepository, UserRepository userRepository) {

        this.programRepository = programRepository;
        this.userRepository = userRepository;
    }

    public List<ProgramViewDTO> getProgram() {
        HashMap<Integer,String> result = new HashMap<>();
        List<ProgramViewDTO> programViewDTOS = new ArrayList<>();
        HashMap<Integer, List<HelperProgram>> result_aux = new HashMap<>();
        List<Program> programs = programRepository.findAll();

        for(Program p: programs){
            Calendar startProgram = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            Calendar endProgram = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            startProgram.setTime(p.getStartProgram());
            endProgram.setTime(p.getEndProgram());
            setYearMonthAndDayForCalendar(startProgram);
            setYearMonthAndDayForCalendar(endProgram);

            int startHour;
            int startMinute;
            int endHour;
            int endMinute;

            String stringStartHour;
            String stringStartMinute;
            String stringEndHour;
            String stringEndMinute;

            if(result_aux.get(p.getDay())==null){
                List<HelperProgram> program_helper = new ArrayList<>();
                program_helper.add(new HelperProgram(startProgram, endProgram));
                result_aux.put(p.getDay(), program_helper);

                startHour = startProgram.get(Calendar.HOUR_OF_DAY);
                startMinute = startProgram.get(Calendar.MINUTE);
                endHour = endProgram.get(Calendar.HOUR_OF_DAY);
                endMinute = endProgram.get(Calendar.MINUTE);

                stringStartHour = "";
                stringStartMinute = "";
                stringEndHour = "";
                stringEndMinute = "";
                if(startHour==0) stringStartHour="00";
                else stringStartHour += startHour;
                if(startMinute==0) stringStartMinute="00";
                else stringStartMinute += startMinute;
                if(endHour==0) stringEndHour="00";
                else stringEndHour += endHour;
                if(endMinute==0) stringEndMinute="00";
                else stringEndMinute += endMinute;

                result.put(p.getDay(), stringStartHour+":"+stringStartMinute+"-"+stringEndHour+":"+stringEndMinute);
            }
            else {
                List<HelperProgram> program_helper = result_aux.get(p.getDay());
                for(int i=0;i<program_helper.size();i++){

                    if(startProgram.compareTo(program_helper.get(i).getStartProgram())<0){

                        if(endProgram.compareTo(program_helper.get(i).getStartProgram())<0){
                            program_helper.add(new HelperProgram(startProgram, endProgram));
                            break;
                        }
                        else if(endProgram.compareTo(program_helper.get(i).getEndProgram())<0) {
                            program_helper.get(i).setStartProgram(startProgram);
                            break;

                        }
                        else {
                                program_helper.get(i).setStartProgram(startProgram);
                                program_helper.get(i).setEndProgram(endProgram);
                                break;
                        }

                    }

                    else {

                        if(startProgram.compareTo(program_helper.get(i).getEndProgram())>0){
                            program_helper.add(new HelperProgram(startProgram, endProgram));
                            break;
                        }
                        else if(endProgram.compareTo(program_helper.get(i).getEndProgram())<0){
                            break;
                        }
                        else {
                            program_helper.get(i).setEndProgram(endProgram);
                            break;
                        }

                    }

                }
                result_aux.put(p.getDay(), program_helper);
                StringBuilder aux = new StringBuilder();
                for(int i=0;i<program_helper.size();i++){
                    startHour = program_helper.get(i).getStartProgram().get(Calendar.HOUR_OF_DAY);
                    startMinute = program_helper.get(i).getStartProgram().get(Calendar.MINUTE);
                    endHour = program_helper.get(i).getEndProgram().get(Calendar.HOUR_OF_DAY);
                    endMinute = program_helper.get(i).getEndProgram().get(Calendar.MINUTE);
                    stringStartHour = "";
                    stringStartMinute = "";
                    stringEndHour = "";
                    stringEndMinute = "";
                    if(startHour==0) stringStartHour="00";
                    else stringStartHour += startHour;
                    if(startMinute==0) stringStartMinute="00";
                    else stringStartMinute += startMinute;
                    if(endHour==0) stringEndHour="00";
                    else stringEndHour += endHour;
                    if(endMinute==0) stringEndMinute="00";
                    else stringEndMinute += endMinute;

                    if(i==program_helper.size()-1){
                        aux.append(stringStartHour).append(":").append(stringStartMinute).append("-").append(stringEndHour).append(":").append(stringEndMinute);
                    }
                    else {
                        aux.append(stringStartHour).append(":").append(stringStartMinute).append("-").append(stringEndHour).append(":").append(stringEndMinute).append(",");
                    }
                }
                result.put(p.getDay(), aux.toString());
            }
        }

        for(Integer day : result.keySet()){
            ProgramViewDTO programViewDTO = new ProgramViewDTO(day, result.get(day));
            programViewDTOS.add(programViewDTO);

        }
        return programViewDTOS;
    }

    private void setYearMonthAndDayForCalendar(Calendar startProgram) {
        startProgram.set(Calendar.YEAR, Calendar.getInstance().get(Calendar.YEAR));
        startProgram.set(Calendar.MONTH, Calendar.getInstance().get(Calendar.MONTH));
        startProgram.set(Calendar.DAY_OF_MONTH, Calendar.getInstance().get(Calendar.DAY_OF_MONTH));
    }

    public ResponseEntity<?> getProgramForBarber(long user_id, int day){

        Optional<User> user = userRepository.findById(user_id);

        if(!user.isPresent()){
            LOGGER.debug("ERROR: Barber with id: {} doesn't exist anymore!", user_id);
            return ResponseEntity.badRequest().body(new MessageResponse("ERROR: Barber with id: " + user_id +" doesn't exist anymore!"));
        }

        Optional<Program> result = programRepository.findByDayAndUser(day, user.get());


        if(result.isPresent()) {
            return ResponseEntity.ok().body(ProgramBuilder.toDTO(result.get()));
        }

        return ResponseEntity.ok().body(new MessageResponse("Barber is free today!"));
    }

    public ResponseEntity<?> getAllProgramsForBarber(long user_id){

        Optional<User> user = userRepository.findById(user_id);

        if(!user.isPresent()){
            LOGGER.debug("ERROR: Barber with id: {} doesn't exist anymore!", user_id);
            return ResponseEntity.badRequest().body(new MessageResponse("ERROR: Barber with id: " + user_id +" doesn't exist anymore!"));
        }

        List<Program> result = programRepository.findAllByUser(user.get());

        return ResponseEntity.ok().body(result.stream().map(ProgramBuilder::toDTO).collect(Collectors.toList()));
    }

}
