package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.SecurityConfig.jwt.JwtUtils;
import ro.tuc.ds2020.SecurityConfig.services.UserDetailsImpl;
import ro.tuc.ds2020.dtos.AppointmentDTO;
import ro.tuc.ds2020.dtos.ExpiryDateLimitAppointment;
import ro.tuc.ds2020.dtos.builders.AppointmentBuilder;
import ro.tuc.ds2020.entities.*;
import ro.tuc.ds2020.services.mailSender.EmailServiceImpl;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AppointmentService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PackageRepository packageRepository;
    private final AppointmentRepository appointmentRepository;
    private final EmailServiceImpl emailService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AppointmentService(AuthenticationManager authenticationManager, UserRepository userRepository, ServiceRepository serviceRepository, PackageRepository packageRepository, AppointmentRepository appointmentRepository, EmailServiceImpl emailService, JwtUtils jwtUtils) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.packageRepository = packageRepository;
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;

    }

    public ResponseEntity<?> edit(AppointmentDTO appointmentDTO){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(appointmentDTO.getUsername(), appointmentDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if(!appointmentDTO.getUser_id().equals(userDetails.getId())){
            LOGGER.debug("Error: You are not allowed to perform such operation on another account!");
            return ResponseEntity.status(401).body(new MessageResponse("Error: You are not allowed to perform such operation on another account!"));
        }

        Optional<User> user = userRepository.findById(appointmentDTO.getUser_id());
        Optional<User> barber = userRepository.findById(appointmentDTO.getBarber_id());

        if(!user.isPresent()){
            LOGGER.debug("Error: User with id: {} don't exist anymore!", appointmentDTO.getUser_id());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with id: " + appointmentDTO.getUser_id()+" don't exist anymore!"));
        }

        if(!barber.isPresent()){
            LOGGER.debug("Error: Barber with id {} don't exist anymore!", appointmentDTO.getBarber_id());
            return ResponseEntity.status(402).body(new MessageResponse("Error: Barber with id: " + appointmentDTO.getBarber_id()+" don't exist anymore!"));
        }



        List<Appointment> appointments = appointmentRepository.findAllByBarber(barber.get());

        for(Appointment a : appointments){
            Calendar calendar1_start = Calendar.getInstance();
            Calendar calendar2_start = Calendar.getInstance();
            Calendar calendar1_end = Calendar.getInstance();
            Calendar calendar2_end = Calendar.getInstance();
            calendar1_start.setTime(appointmentDTO.getStartAppointment());
            calendar2_start.setTime(a.getStartAppointment());
            calendar1_end.setTime(appointmentDTO.getEndAppointment());
            calendar2_end.setTime(a.getEndAppointment());
            if(calendar1_start.get(Calendar.DAY_OF_YEAR) == calendar2_start.get(Calendar.DAY_OF_YEAR) &&
                    calendar1_start.get(Calendar.YEAR) == calendar2_start.get(Calendar.YEAR)){

                        if((calendar1_start.before(calendar2_end) || calendar1_start.equals(calendar2_end)) && (calendar2_start.before(calendar1_end) || calendar2_start.equals(calendar1_end))) {

                            LOGGER.debug("Error: A new appointment has been made in the meantime and your appointment can no longer be performed!");
                            return ResponseEntity.status(405).body(new MessageResponse("Error: A new appointment has been made in the meantime and your appointment can no longer be performed!"));

                        }
            }
        }

        Appointment appointment = appointmentRepository.findById(appointmentDTO.getId()).get();
        appointment.getServices().clear();

        appointment.setBarber(barber.get());
        appointment.setStartAppointment(appointmentDTO.getStartAppointment());
        appointment.setEndAppointment(appointmentDTO.getEndAppointment());

        StringBuilder servicesMessage = new StringBuilder();

        if(appointmentDTO.getPackage_id()!=null){

            Optional<PackagePromotional> packagePromotional = packageRepository.findById(appointmentDTO.getPackage_id());
            if(!packagePromotional.isPresent()){
                LOGGER.debug("Error: Package with id: {} don't exist anymore!", appointmentDTO.getPackage_id());
                return ResponseEntity.status(403).body(new MessageResponse("Error: Package with id: " + appointmentDTO.getPackage_id() + " don't exist anymore!"));
            }

            PackagePromotional package_promotional = packagePromotional.get();

            for(Services service : package_promotional.getServices()){

                appointment.getServices().add(service);

                if(appointmentDTO.getLanguage().equals("ro")) {
                    servicesMessage.append("<li>").append(service.getNameRo()).append("</li>");
                }
                else {
                    servicesMessage.append("<li>").append(service.getNameEn()).append("</li>");
                }

            }
        }

        if(appointmentDTO.getServices_Id().size()>0){

            List<Integer> services_id = appointmentDTO.getServices_Id();

            for (Integer integer : services_id) {
                Optional<Services> service = serviceRepository.findById(integer);
                if (!service.isPresent()) {
                    LOGGER.debug("Error: Service with id: {} don't exist anymore!", integer);
                    return ResponseEntity.status(404).body(new MessageResponse("Error: Service with id: " + integer + " don't exist anymore!"));
                }
                appointment.getServices().add(service.get());

                if (appointmentDTO.getLanguage().equals("ro")) {
                    servicesMessage.append("<li>").append(service.get().getNameRo()).append("</li>");
                } else {
                    servicesMessage.append("<li>").append(service.get().getNameEn()).append("</li>");
                }

            }
        }

        appointmentRepository.save(appointment);

        DateFormat formatter= new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        formatter.setTimeZone(TimeZone.getTimeZone("Europe/Bucharest"));

        String subject = appointmentDTO.getLanguage().equals("en") ? "Booking confirmation" : "Confirmare rezervare";
        String message = appointmentDTO.getLanguage().equals("en") ?
                "Hello,<br/>We are sending you this message to confirm the reservation you made a few moments ago for: " + formatter.format(appointmentDTO.getStartAppointment()) + " for the following services:<br/>" + servicesMessage + "<br/>The total price is: " + appointment.getPrice()+" lei.<br/>Thanks and have a good day!"
                :"Buna ziua,<br/>Va trimitem acest mesaj pentru a confirma rezervarea pe care ati facut-o cu cateva momenta in urma pentru data de: " + formatter.format(appointmentDTO.getStartAppointment()) + " pentru urmatoarele servicii: " + servicesMessage + "<br/>Pretul total fiind de: " + appointment.getPrice() + " lei.<br/>Multumim si o zi buna!";

        emailService.sendSimpleMessage(user.get().getEmail(),subject, message);

        return ResponseEntity.ok().body(AppointmentBuilder.toDTO(appointment));

    }

    public ResponseEntity<?> insert(AppointmentDTO appointmentDTO){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(appointmentDTO.getUsername(), appointmentDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if(!appointmentDTO.getUser_id().equals(userDetails.getId())){
            LOGGER.debug("Error: You are not allowed to perform such operation on another account!");
            return ResponseEntity.status(401).body(new MessageResponse("Error: You are not allowed to perform such operation on another account!"));
        }

        Optional<User> user = userRepository.findById(appointmentDTO.getUser_id());
        Optional<User> barber = userRepository.findById(appointmentDTO.getBarber_id());

        if(!user.isPresent()){
            LOGGER.debug("Error: User with id: {} don't exist anymore!", appointmentDTO.getUser_id());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with id: " + appointmentDTO.getUser_id()+" don't exist anymore!"));
        }

        if(!barber.isPresent()){
            LOGGER.debug("Error: Barber with id {} don't exist anymore!", appointmentDTO.getBarber_id());
            return ResponseEntity.status(402).body(new MessageResponse("Error: Barber with id: " + appointmentDTO.getBarber_id()+" don't exist anymore!"));
        }

        if(user.get().getExpiryDate()!=null){
            if(new Date().before(user.get().getExpiryDate())){
                if(user.get().getNrAppointments()>=3){
                    return ResponseEntity.status(406).body(new ExpiryDateLimitAppointment(user.get().getExpiryDate()));
                }
            }
            else {
                Date date = new Date();
                user.get().setNrAppointments(0);
                user.get().setTimeForFirstAppointmentOfTheDay(date);
                user.get().setExpiryDate(new Date(date.getTime() + 1000 * 60 * 60 * 24));

            }
        }

        List<Appointment> appointments = appointmentRepository.findAllByBarber(barber.get());

        for(Appointment a : appointments){
            Calendar calendar1_start = Calendar.getInstance();
            Calendar calendar2_start = Calendar.getInstance();
            Calendar calendar1_end = Calendar.getInstance();
            Calendar calendar2_end = Calendar.getInstance();
            calendar1_start.setTime(appointmentDTO.getStartAppointment());
            calendar2_start.setTime(a.getStartAppointment());
            calendar1_end.setTime(appointmentDTO.getEndAppointment());
            calendar2_end.setTime(a.getEndAppointment());
            if(calendar1_start.get(Calendar.DAY_OF_YEAR) == calendar2_start.get(Calendar.DAY_OF_YEAR) &&
                    calendar1_start.get(Calendar.YEAR) == calendar2_start.get(Calendar.YEAR)){

                if((calendar1_start.before(calendar2_end) || calendar1_start.equals(calendar2_end)) && (calendar2_start.before(calendar1_end) || calendar2_start.equals(calendar1_end))) {

                    LOGGER.debug("Error: A new appointment has been made in the meantime and your appointment can no longer be performed!");
                    return ResponseEntity.status(405).body(new MessageResponse("Error: A new appointment has been made in the meantime and your appointment can no longer be performed!"));

                }
            }
        }

        Appointment appointment = new Appointment(appointmentDTO.getStartAppointment(), appointmentDTO.getEndAppointment(), user.get(), barber.get(), appointmentDTO.getPrice());

        StringBuilder servicesMessage = new StringBuilder();

        if(appointmentDTO.getPackage_id()!=null){

            Optional<PackagePromotional> packagePromotional = packageRepository.findById(appointmentDTO.getPackage_id());
            if(!packagePromotional.isPresent()){
                LOGGER.debug("Error: Package with id: {} don't exist anymore!", appointmentDTO.getPackage_id());
                return ResponseEntity.status(403).body(new MessageResponse("Error: Package with id: " + appointmentDTO.getPackage_id() + " don't exist anymore!"));
            }

            PackagePromotional package_promotional = packagePromotional.get();

            for(Services service : package_promotional.getServices()){

                appointment.getServices().add(service);

                if(appointmentDTO.getLanguage().equals("ro")) {
                    servicesMessage.append("<li>").append(service.getNameRo()).append("</li>");
                }
                else {
                    servicesMessage.append("<li>").append(service.getNameEn()).append("</li>");
                }

            }
        }

        if(appointmentDTO.getServices_Id().size()>0){

            List<Integer> services_id = appointmentDTO.getServices_Id();

            for (Integer integer : services_id) {
                Optional<Services> service = serviceRepository.findById(integer);
                if (!service.isPresent()) {
                    LOGGER.debug("Error: Service with id: {} don't exist anymore!", integer);
                    return ResponseEntity.status(404).body(new MessageResponse("Error: Service with id: " + integer + " don't exist anymore!"));
                }
                appointment.getServices().add(service.get());

                if (appointmentDTO.getLanguage().equals("ro")) {
                    servicesMessage.append("<li>").append(service.get().getNameRo()).append("</li>");
                } else {
                    servicesMessage.append("<li>").append(service.get().getNameEn()).append("</li>");
                }

            }
        }

        appointmentRepository.save(appointment);

        if(user.get().getTimeForFirstAppointmentOfTheDay()==null){

            Date dateNow = new Date();

            user.get().setTimeForFirstAppointmentOfTheDay(dateNow);
            user.get().setExpiryDate(new Date(dateNow.getTime() + 1000 * 60 * 60 * 24));
            user.get().setNrAppointments(1);

        }
        else {
            user.get().setNrAppointments(user.get().getNrAppointments() + 1);
        }

        userRepository.save(user.get());

        DateFormat formatter= new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        formatter.setTimeZone(TimeZone.getTimeZone("Europe/Bucharest"));

        String subject = appointmentDTO.getLanguage().equals("en") ? "Booking confirmation" : "Confirmare rezervare";
        String message = appointmentDTO.getLanguage().equals("en") ?
                "Hello,<br/>We are sending you this message to confirm the reservation you made a few moments ago for: " + formatter.format(appointmentDTO.getStartAppointment()) + " for the following services:<br/>" + servicesMessage + "<br/>The total price is: " + appointment.getPrice()+" lei.<br/>Thanks and have a good day!"
                :"Buna ziua,<br/>Va trimitem acest mesaj pentru a confirma rezervarea pe care ati facut-o cu cateva momenta in urma pentru data de: " + formatter.format(appointmentDTO.getStartAppointment()) + " pentru urmatoarele servicii: " + servicesMessage + "<br/>Pretul total fiind de: " + appointment.getPrice() + " lei.<br/>Multumim si o zi buna!";

        emailService.sendSimpleMessage(user.get().getEmail(),subject, message);

        return ResponseEntity.ok().body(AppointmentBuilder.toDTO(appointment));

    }

    public ResponseEntity<?> getAppointmentsForBarber(long barber_id, Date date){

        Optional<User> barber = userRepository.findById(barber_id);
        if(!barber.isPresent()){
            LOGGER.debug("Error: Barber with id: {} don't exist anymore!", barber_id);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Barber with id: " + barber_id +" don't exist anymore!"));
        }
        List<Appointment> appointments = appointmentRepository.findAllByBarber(barber.get());

        return ResponseEntity.ok().body(appointments.stream().filter(e -> {
            Calendar calendar1 = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            Calendar calendar2 = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
            calendar1.setTime(e.getStartAppointment());
            calendar2.setTime(date);
            return calendar1.get(Calendar.DAY_OF_YEAR) == calendar2.get(Calendar.DAY_OF_YEAR) &&
                    calendar1.get(Calendar.YEAR) == calendar2.get(Calendar.YEAR);
        }).map(AppointmentBuilder::toDTO).collect(Collectors.toList()));
    }

    public ResponseEntity<?> getAppointmentsForCalendarOfBarber(long barber_id){
        Optional<User> barber = userRepository.findById(barber_id);
        if(!barber.isPresent()){
            LOGGER.debug("Error: Barber with id: {} don't exist anymore!", barber_id);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Barber with id: " + barber_id +" don't exist anymore!"));
        }
        List<Appointment> appointments = appointmentRepository.findAllByBarber(barber.get());

        return ResponseEntity.ok().body(appointments.stream().map(AppointmentBuilder::toDTOForCalendar).collect(Collectors.toList()));
    }

    public ResponseEntity<?> getAppointmentsForUser(String username, String token){

        if(!username.equals(jwtUtils.getUserNameFromJwtToken(token))){
            return ResponseEntity.status(401).body(new MessageResponse("Error: You don't have permission to view appointments for this user!"));
        }

        Optional<User> user = userRepository.findByUsername(username);
        if(!user.isPresent()){
            LOGGER.debug("Error: User with username: {} don't exist anymore!", username);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with username: " + username + "don't exist anymore!"));
        }

        return ResponseEntity.ok().body(appointmentRepository.findAllByUser(user.get()).stream().map(AppointmentBuilder::toDTOForUser).collect(Collectors.toList()));
    }

    public ResponseEntity<?> deleteAppointment(AppointmentDTO appointmentDTO){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(appointmentDTO.getUsername(), appointmentDTO.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        boolean isBarber = false;

        for(String role: roles){
            if (role.equals("ROLE_BARBER")) {
                isBarber = true;
                break;
            }
        }


        Optional<Appointment> appointment = appointmentRepository.findById(appointmentDTO.getId());


        if(!appointment.isPresent()){
            LOGGER.debug("Error: The appointment with id: {} don't exist anymore!", appointmentDTO.getId());
            return ResponseEntity.status(402).body(new MessageResponse("Error: The appointment with id: " + appointmentDTO.getId()+" don't exist anymore!"));
        }

        if(!isBarber && !appointment.get().getUser().getId().equals(userDetails.getId())){
            LOGGER.debug("Error: You are not allowed to perform such operation on another account!");
            return ResponseEntity.status(401).body(new MessageResponse("Error: You are not allowed to perform such operation on another account!"));
        }

        if(appointment.get().getStartAppointment().before(new Date())){
            LOGGER.debug("Error: You cannot delete this appointment, the start date of this appointment has already passed!");
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You cannot delete this appointment, the start date of this appointment has already passed!"));
        }

        Optional<User> user = userRepository.findById(appointment.get().getUser().getId());

        if(isBarber){
            Optional<User> barber = userRepository.findById(appointment.get().getBarber().getId());

            if(!barber.get().getId().equals(userDetails.getId())){
                LOGGER.debug("Error: You cannot delete appointments from other barbers!");
                return ResponseEntity.status(401).body(new MessageResponse("Error: You cannot delete appointments from other barbers!"));
            }

            DateFormat formatter= new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            formatter.setTimeZone(TimeZone.getTimeZone("Europe/Bucharest"));

            String subject = appointmentDTO.getLanguage().equals("en") ? "Cancellation of the appointment by a barber" : "Anularea programarii de catre un frizer";
            String message = appointmentDTO.getLanguage().equals("en") ? "Hello,<br/>Sorry to let you know, but your appointment from: "+ formatter.format(appointment.get().getStartAppointment()) + " has been canceled by our barber: "+ barber.get().getName() + ", the reason being: " + "\"" + appointmentDTO.getMessage() + "\".<br/>Sorry for the inconvenience, we wish you a good day!" : "Buna ziua,<br/>Ne pare rau sa te anuntam, dar programarea ta din data de: " + formatter.format(appointment.get().getStartAppointment())+" a fost anulata de catre frizerul nostru: " + barber.get().getName() +" , motivul fiind urmatorul: " + "\"" + appointmentDTO.getMessage()+"\".<br/>Ne pare rau pentru inconvenientele provocate, o zi buna va dorim!";


            emailService.sendSimpleMessage(user.get().getEmail(), subject, message );
        }

        appointmentRepository.deleteById(appointmentDTO.getId());


        if(user.get().getNrAppointments()>=1) {

            user.get().setNrAppointments(user.get().getNrAppointments() - 1);

            userRepository.save(user.get());
        }

        return ResponseEntity.ok().body(new MessageResponse("The appointment with id: " + appointmentDTO.getId()+" was deleted successfully!"));
    }

}
