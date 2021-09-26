package ro.tuc.ds2020.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import ro.tuc.ds2020.SecurityConfig.jwt.JwtUtils;
import ro.tuc.ds2020.SecurityConfig.services.UserDetailsImpl;
import ro.tuc.ds2020.dtos.BarberDTO;
import ro.tuc.ds2020.dtos.BarberViewDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.builders.BarberBuilder;
import ro.tuc.ds2020.dtos.builders.BarberViewBuilder;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.*;
import ro.tuc.ds2020.services.mailSender.EmailServiceImpl;
import ro.tuc.ds2020.payload.request.ChangePasswordRequest;
import ro.tuc.ds2020.payload.request.ContactRequest;
import ro.tuc.ds2020.payload.request.ResetPasswordRequest;
import ro.tuc.ds2020.payload.request.SignupRequest;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.*;

import javax.validation.Valid;
import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailServiceImpl emailService;
    private final PasswordEncoder encoder;
    private final RoleRepository roleRepository;
    private final ProgramRepository programRepository;
    private final ServiceRepository serviceRepository;
    private final PackageRepository packageRepository;
    private final AuthenticationManager authenticationManager;
    private final AppointmentRepository appointmentRepository;
    private final AmazonS3 s3client;
    private final JwtUtils jwtUtils;
    private final ActivationTokenRepository activationTokenRepository;

    @Value("${app.awsServices.bucketName}")
    private String bucketName;

    @Autowired
    public UserService(UserRepository userRepository, PasswordResetRepository passwordResetRepository,EmailServiceImpl emailService, PasswordEncoder encoder,RoleRepository roleRepository, ProgramRepository programRepository, ServiceRepository serviceRepository, PackageRepository packageRepository, AuthenticationManager authenticationManager, AppointmentRepository appointmentRepository, AmazonS3 s3client, JwtUtils jwtUtils, ActivationTokenRepository activationTokenRepository) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.emailService = emailService;
        this.encoder = encoder;
        this.roleRepository = roleRepository;
        this.programRepository = programRepository;
        this.serviceRepository = serviceRepository;
        this.packageRepository = packageRepository;
        this.authenticationManager = authenticationManager;
        this.appointmentRepository = appointmentRepository;
        this.s3client = s3client;
        this.jwtUtils = jwtUtils;
        this.activationTokenRepository = activationTokenRepository;
    }

    public ResponseEntity<?> findUserById(long id) {

        Optional<User> user_optional = userRepository.findById(id);

        if (!user_optional.isPresent()) {
            LOGGER.debug("User with id: {} do not exists!", id);
            return ResponseEntity.badRequest().body(new MessageResponse("User with id: " + id + " do not exists!"));
        }

        User user = user_optional.get();

        String encodedString = getBase64StringFromImagePath(user.getPhoto());

        user.setPhoto(encodedString);

        return ResponseEntity.ok(BarberBuilder.toDTO(user));

    }

    public ResponseEntity<?> findUserByUsername(String username, String token) {

        String usernameFromJwt = jwtUtils.getUserNameFromJwtToken(token);

        if(!usernameFromJwt.equals(username)){
            return ResponseEntity.status(401).body(new MessageResponse("Error: You don't have acces to view this profile"));
        }

        Optional<User> user_optional = userRepository.findByUsername(username);

        if (!user_optional.isPresent()) {
            LOGGER.debug("User with username: {} do not exists!", username);
            return ResponseEntity.badRequest().body(new MessageResponse("User with username: " + username + " do not exists!"));
        }

        User user = user_optional.get();

        String encodedString = getBase64StringFromImagePath(user.getPhoto());

        user.setPhoto(encodedString);

        return ResponseEntity.ok(BarberBuilder.toDTO(user));

    }

     private String getBase64StringFromImagePath(String path){

        S3Object object = s3client.getObject(bucketName, path);

         byte[] fileContent = new byte[0];
         try {
             fileContent = IOUtils.toByteArray(object.getObjectContent());
         } catch (IOException e) {
             e.printStackTrace();
         }

         return Base64
                .getEncoder()
                .encodeToString(fileContent);

    }

    public ResponseEntity<?> updateUser(@Valid @RequestBody SignupRequest request) {

        Optional<User> user_optional = userRepository.findById(request.getId());
        Optional<User> user_email = userRepository.findByEmail(request.getEmail());

        if(!user_optional.isPresent()){

            LOGGER.debug("User with id: {} do not exists!",request.getId());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with id: " + request.getId() +" do not exists!"));
        }

        if(user_email.isPresent() && !user_email.get().getEmail().equals(user_optional.get().getEmail())){

            LOGGER.debug("Error: Email: {} already exists!", request.getEmail());
            return ResponseEntity.status(404).body(new MessageResponse("Error: Email: " + request.getEmail() +" already exists!"));
        }

        User user = user_optional.get();

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setCity(request.getCity());

        String path = ".\\src\\main\\java\\ro\\tuc\\ds2020\\images\\" + request.getUsername();
        String photoBase64 = request.getPhoto();
        String extension = photoBase64.substring(photoBase64.indexOf("/") + 1, photoBase64.indexOf(";"));
        photoBase64 = photoBase64.substring(photoBase64.indexOf(",") + 1);
        String fullPath = path + "." + extension;
        String fileName = request.getUsername()+"."+extension;

        s3client.deleteObject(bucketName, user.getPhoto());

        File outputFile = new File(fullPath);

        byte[] decodedBytes = Base64.getDecoder().decode(photoBase64);

        try {
            FileUtils.writeByteArrayToFile(outputFile, decodedBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }


        s3client.putObject(new PutObjectRequest(bucketName, fileName, outputFile));

        user.setPhoto(fileName);
        user.getRoles().clear();
        user.getServices().clear();
        user.getPackages().clear();
        user.getPrograms().clear();

        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();

        AtomicBoolean barber = new AtomicBoolean(false);

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            userRole.getUsers().add(user);
            roleRepository.save(userRole);

        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        adminRole.getUsers().add(user);
                        roleRepository.save(adminRole);

                        break;
                    case "barber":
                        Role modRole = roleRepository.findByName(ERole.ROLE_BARBER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        modRole.getUsers().add(user);
                        roleRepository.save(modRole);
                        barber.set(true);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                        userRole.getUsers().add(user);
                        roleRepository.save(userRole);

                }
            });
        }

        user.setRoles(roles);

        userRepository.save(user);

        List<Integer> days = request.getDays_id();
        List<Date> start_days = request.getStart_id();
        List<Date> end_days = request.getEnd_id();
        List<Integer> services_id = request.getServices_id();
        List<Integer> package_id = request.getPackages_id();
        if(days!=null){
            for(int i=0;i < days.size();i++){
                Program program = new Program(days.get(i),start_days.get(i),end_days.get(i), user);
                program = programRepository.save(program);
                user.getPrograms().add(program);

            }
        }

        if(services_id!=null){
            for (Integer integer : services_id) {
                Optional<Services> service = serviceRepository.findById(integer);
                if (service.isPresent()) {
                    user.getServices().add(service.get());
                    service.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(402).body(new MessageResponse("Service with id: " + integer + " do not exists!"));
                }
            }
        }

        if(package_id!=null){
            for (Integer integer : package_id) {
                Optional<PackagePromotional> packagePromotional = packageRepository.findById(integer);
                if (packagePromotional.isPresent()) {
                    user.getPackages().add(packagePromotional.get());
                    packagePromotional.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(403).body(new MessageResponse("Package with id: " + integer + " do not exists!"));
                }
            }
        }

        userRepository.save(user);

        user.setPhoto(getBase64StringFromImagePath(user.getPhoto()));
        if(barber.get())
            return ResponseEntity.ok(BarberBuilder.toDTO(user));

        return ResponseEntity.ok(UserBuilder.toDTO(user));


    }


    public ResponseEntity<?> updateProfile(@Valid @RequestBody SignupRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();


        Optional<User> user_optional = userRepository.findById(userDetails.getId());
        Optional<User> user_email = userRepository.findByEmail(request.getEmail());

        if(!user_optional.isPresent()){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with id: " + request.getId() +" do not exists!"));
        }

        if(user_email.isPresent() && !user_email.get().getEmail().equals(user_optional.get().getEmail())){
            return ResponseEntity.status(404).body(new MessageResponse("Error: Email: " + request.getEmail() +" already exists!"));
        }

        User user = user_optional.get();

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setCity(request.getCity());

        String path = ".\\src\\main\\java\\ro\\tuc\\ds2020\\images\\" + request.getUsername();
        String photoBase64 = request.getPhoto();
        String extension = photoBase64.substring(photoBase64.indexOf("/") + 1, photoBase64.indexOf(";"));
        photoBase64 = photoBase64.substring(photoBase64.indexOf(",") + 1);
        String fullPath = path + "." + extension;
        String fileName = request.getUsername()+"."+extension;

        s3client.deleteObject(bucketName, user.getPhoto());

        File outputFile = new File(fullPath);

        byte[] decodedBytes = Base64.getDecoder().decode(photoBase64);

        try {
            FileUtils.writeByteArrayToFile(outputFile, decodedBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }


        s3client.putObject(new PutObjectRequest(bucketName, fileName, outputFile));

        user.setPhoto(fileName);
        user.getServices().clear();
        user.getPackages().clear();

        boolean isBarber = false;

        for(Role role : user.getRoles()){
            if(role.getName().equals(ERole.ROLE_BARBER)){
                isBarber = true;
                break;
            }
        }

        userRepository.save(user);


        List<Integer> services_id = request.getServices_id();
        List<Integer> package_id = request.getPackages_id();


        if(services_id!=null){
            for (Integer integer : services_id) {
                Optional<Services> service = serviceRepository.findById(integer);
                if (service.isPresent()) {
                    user.getServices().add(service.get());
                    service.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(402).body(new MessageResponse("Service with id: " + integer + " do not exists!"));
                }
            }
        }

        if(package_id!=null){
            for (Integer integer : package_id) {
                Optional<PackagePromotional> packagePromotional = packageRepository.findById(integer);
                if (packagePromotional.isPresent()) {
                    user.getPackages().add(packagePromotional.get());
                    packagePromotional.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(403).body(new MessageResponse("Package with id: " + integer + " do not exists!"));
                }
            }
        }

        userRepository.save(user);

        user.setPhoto(getBase64StringFromImagePath(user.getPhoto()));
        user.setPassword(request.getNewPassword());

        if(isBarber)
            return ResponseEntity.ok(BarberBuilder.toDTOWithPassword(user));

        return ResponseEntity.ok(UserBuilder.toDTOWithPassword(user));


    }

    public ResponseEntity<?> activateAccount(String token){

        if (activationTokenRepository.existsByToken(token)) {
            ActivationToken activationToken = activationTokenRepository.findByToken(token);

            if (activationToken != null) {
                User user = userRepository.findByUsername(activationToken.getUser().getUsername()).get();
                if (user.isActivate()) {

                    return ResponseEntity
                            .accepted()
                            .body(new MessageResponse("The account has been activated already!"));

                }

                user.setActivate(true);
                userRepository.save(user);
                return ResponseEntity
                        .ok()
                        .body(new MessageResponse("The account has been activated!"));

            }
        }

        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: This account don't exist!"));
    }

    public ResponseEntity<?> resetPassword(ResetPasswordRequest request){


        Optional<User> user_optional = userRepository.findByEmail(request.getEmail());

        if(!user_optional.isPresent()) {

            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: This email does not exist!"));

        }

        String token = UUID.randomUUID().toString();

        while(passwordResetRepository.findByToken(token)!=null){
            token = UUID.randomUUID().toString();
        }

        User user = user_optional.get();

        createPasswordResetTokenForUser(user, token);

        String message = request.getMessage() + "<a href=https://frontendbarbershop.herokuapp.com/reset_password/" + token + ">Link<a>.";
        emailService.sendSimpleMessage(request.getEmail(),request.getSubject(),message);

        deleteAllExpiredTokens();

        return ResponseEntity.ok().body(new MessageResponse("An email has been sent to you where you can reset your password!"));

    }

    private void deleteAllExpiredTokens(){
        List<PasswordResetToken> passwordResetTokens = passwordResetRepository.findAll();

        for(PasswordResetToken passwordResetToken: passwordResetTokens){
            if(isTokenExpired(passwordResetToken)){
                passwordResetRepository.delete(passwordResetToken);
            }
        }
    }

    public ResponseEntity<?> changePassword(ChangePasswordRequest request){

        String token = request.getToken();

        Integer status = validatePasswordResetToken(token);

        if(!request.getPassword().equals(request.getPassword_confirmation())){
            return ResponseEntity.status(402).body(new MessageResponse("Error: Passwords do not match!"));
        }

        if(status == 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token!"));
        }

        if(status == 1){
            return ResponseEntity.status(401).body(new MessageResponse("Error: Expired token!"));
        }

        Long id_user = passwordResetRepository.findByToken(token).getUser().getId();

        if(userRepository.findById(id_user).isPresent()) {
            User user = userRepository.findById(id_user).get();

            user.setPassword(encoder.encode(request.getPassword()));
            userRepository.save(user);
            passwordResetRepository.deleteByToken(request.getToken());
        }
        return ResponseEntity.ok().body(new MessageResponse("Password changed successfully!"));

    }


    public ResponseEntity<?> verifyToken(String token){

        Integer status = validatePasswordResetToken(token);

        if(status == 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token!"));
        }

        if(status == 1){
            return ResponseEntity.status(401).body(new MessageResponse("Error: Expired token!"));
        }

        return ResponseEntity.ok().body(new MessageResponse("Token is valid!"));

    }

    public void createPasswordResetTokenForUser(User user, String token) {
        Date currentDate = new Date();
        PasswordResetToken myToken = new PasswordResetToken(user, token, currentDate);
        passwordResetRepository.save(myToken);
    }

    public Integer validatePasswordResetToken(String token) {
        final PasswordResetToken passToken = passwordResetRepository.findByToken(token);

        return !isTokenFound(passToken) ? 0
                : isTokenExpired(passToken) ? 1
                : 2 ;
    }

    private boolean isTokenFound(PasswordResetToken passToken) {
        return passToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        final Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));
        return passToken.getExpiryDate().before(cal.getTime());
    }

    public ResponseEntity<?> contactMessage(ContactRequest request){

        String path = "data.csv";

        String response_subject_ro = "Mesajul dumneavoastra a fost primit cu succes";
        String response_subject_en = "Your message was received successfully";
        String response_message_ro = "Buna ziua,<br/>Am primit cu succes mesajul care a fost trimis de la dumneavoastra pe pagina noastra de contact.<br/>In cel mai scurt timp, o persoana din staff-ul nostru va raspunde intrebarilor dvs. printr-un email care va fi trimis la adresa precizata.<br/>In cazul in care nu dumneavoastra ati trimis acel mesaj, va rugam sa ignorati acest email.<br/>O zi buna!";
        String response_message_en = "Hello,<br/>We have successfully received the message that was sent from you on our contact page.<br/>As soon as possible, a person from our staff will answer your questions through a email that will be sent to the specified address.<br/>If you did not send that message, please ignore this email.<br/>Have a good day!";

        File file = new File(".\\src\\main\\java\\ro\\tuc\\ds2020\\csv\\data.csv");

        s3client.getObject(new GetObjectRequest(bucketName,path), file);

        boolean file_exists = file.exists();

        PrintWriter pw = null;
        try {
            pw = new PrintWriter(new FileOutputStream(file, true));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        StringBuilder builder = new StringBuilder();

        if(!file_exists) {
            String columnNamesList = "Name,Email,Telephone,Message";
            builder.append(columnNamesList).append("\n");
        }
        builder.append(request.getName()).append(",");
        builder.append(request.getEmail()).append(",");
        builder.append(request.getTelephone()).append(",");
        builder.append("\"").append(request.getMessage().replace("\n", " ")).append("\"");
        builder.append('\n');
        assert pw != null;
        pw.write(builder.toString());
        pw.close();

        if(request.getLanguage().equals("ro")){

            emailService.sendSimpleMessage(request.getEmail(),response_subject_ro,response_message_ro);

        }

        else {

            emailService.sendSimpleMessage(request.getEmail(),response_subject_en,response_message_en);

        }

        s3client.putObject(new PutObjectRequest(bucketName, path, file));

        return ResponseEntity.ok().body(new MessageResponse("The email was sent successfully!"));
    }


    public List<BarberViewDTO> getBarbersForPublicPage() {
        Optional<Role> barberRole = roleRepository.findByName(ERole.ROLE_BARBER);

        if(!barberRole.isPresent()){
            System.out.println("Barber role do not exists!");
        }

        return barberRole.get().getUsers().stream()
                .peek(e -> e.setPhoto(getBase64StringFromImagePath(e.getPhoto())))
                .map(BarberViewBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public List<BarberDTO> getBarbers() {
        Optional<Role> barberRole = roleRepository.findByName(ERole.ROLE_BARBER);

        if(!barberRole.isPresent()){
            System.out.println("Barber role do not exists!");
        }

        return barberRole.get().getUsers().stream()
                .peek(e -> e.setPhoto(getBase64StringFromImagePath(e.getPhoto())))
                .map(BarberBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsers() {
        Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);

        if(!userRole.isPresent()){
            System.out.println("User role do not exists!");
        }

        return userRole.get().getUsers().stream()
                .peek(e -> e.setPhoto(getBase64StringFromImagePath(e.getPhoto())))
                .map(UserBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAdmins() {
        Optional<Role> adminRole = roleRepository.findByName(ERole.ROLE_ADMIN);

        if(!adminRole.isPresent()) {
            System.out.println("Admin role do not exists!");
        }

        return adminRole.get().getUsers().stream()
                .peek(e -> e.setPhoto(getBase64StringFromImagePath(e.getPhoto())))
                .map(UserBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> insert(@Valid @RequestBody SignupRequest signUpRequest) throws IOException {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if(!signUpRequest.getPassword().equals(signUpRequest.getPassword_confirmation())){

            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Passwords do not match!"));

        }

        String path = ".\\src\\main\\java\\ro\\tuc\\ds2020\\images\\" + signUpRequest.getUsername();
        String photoBase64 = signUpRequest.getPhoto();
        String extension = photoBase64.substring(photoBase64.indexOf("/") + 1, photoBase64.indexOf(";"));
        photoBase64 = photoBase64.substring(photoBase64.indexOf(",") + 1);
        String fullPath = path + "." + extension;

        File outputFile = new File(fullPath);

        byte[] decodedBytes = Base64.getDecoder().decode(photoBase64);

        FileUtils.writeByteArrayToFile(outputFile, decodedBytes);

        s3client.putObject(new PutObjectRequest(bucketName, signUpRequest.getUsername()+"."+extension, outputFile));

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName(),
                signUpRequest.getBirthDate(),
                signUpRequest.getGender(),
                signUpRequest.getCountry(),
                signUpRequest.getState(),
                signUpRequest.getCity(),
                signUpRequest.getUsername()+"."+extension);

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        AtomicBoolean barber = new AtomicBoolean(false);

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            userRole.getUsers().add(user);
            roleRepository.save(userRole);

        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        adminRole.getUsers().add(user);
                        roleRepository.save(adminRole);

                        break;
                    case "barber":
                        Role modRole = roleRepository.findByName(ERole.ROLE_BARBER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        modRole.getUsers().add(user);
                        roleRepository.save(modRole);
                        barber.set(true);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                        userRole.getUsers().add(user);
                        roleRepository.save(userRole);

                }
            });
        }

        user.setRoles(roles);

        userRepository.save(user);

        List<Integer> days = signUpRequest.getDays_id();
        List<Date> start_days = signUpRequest.getStart_id();
        List<Date> end_days = signUpRequest.getEnd_id();
        List<Integer> services_id = signUpRequest.getServices_id();
        List<Integer> package_id = signUpRequest.getPackages_id();
        if(days!=null){
            for(int i=0;i < days.size();i++){
                Program program = new Program(days.get(i),start_days.get(i),end_days.get(i), user);
                program = programRepository.save(program);
                user.getPrograms().add(program);

            }
        }

        if(services_id!=null){
            for (Integer integer : services_id) {
                Optional<Services> service = serviceRepository.findById(integer);
                if (service.isPresent()) {
                    user.getServices().add(service.get());
                    service.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(402).body(new MessageResponse("Service with id: " + integer + " do not exists!"));
                }
            }
        }

        if(package_id!=null){
            for (Integer integer : package_id) {
                Optional<PackagePromotional> packagePromotional = packageRepository.findById(integer);
                if (packagePromotional.isPresent()) {
                    user.getPackages().add(packagePromotional.get());
                    packagePromotional.get().getBarbers().add(user);
                } else {
                    return ResponseEntity.status(403).body(new MessageResponse("Package with id: " + integer + " do not exists!"));
                }
            }
        }

        userRepository.save(user);

        String token = UUID.randomUUID().toString();

        while(activationTokenRepository.findByToken(token)!=null){
            token = UUID.randomUUID().toString();
        }

        ActivationToken activationToken = new ActivationToken(user, token);

        activationTokenRepository.save(activationToken);

        String message = "<a href=\"https://frontendbarbershop.herokuapp.com/activate/" + token + "\">Link</a>.";

        emailService.sendSimpleMessage(signUpRequest.getEmail(), signUpRequest.getSubject(), signUpRequest.getMessage() + message);

        user.setPhoto(getBase64StringFromImagePath(user.getPhoto()));
        if(barber.get())
        return ResponseEntity.ok(BarberBuilder.toDTO(user));

        return ResponseEntity.ok(UserBuilder.toDTO(user));
    }

    public ResponseEntity<?> delete(Long id){
        Optional<User> user = userRepository.findById(id);
        if(!user.isPresent()){
            return ResponseEntity.badRequest().body(new MessageResponse("User with id: " + id + " was not found in db!"));
        }

        s3client.deleteObject(bucketName, user.get().getPhoto());

        List<Appointment> appointmentsUser = appointmentRepository.findAllByUserOrBarber(user.get(), user.get());

        for(Appointment a: appointmentsUser){
            appointmentRepository.delete(a);
        }

        activationTokenRepository.deleteAllByUser(user.get());
        userRepository.delete(user.get());
        return ResponseEntity.ok().body(new MessageResponse("User with id: " + id + " was deleted!"));
    }

}
