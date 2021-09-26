package ro.tuc.ds2020.controllers;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.SecurityConfig.jwt.JwtUtils;
import ro.tuc.ds2020.SecurityConfig.services.UserDetailsImpl;
import ro.tuc.ds2020.entities.*;
import ro.tuc.ds2020.services.mailSender.EmailServiceImpl;
import ro.tuc.ds2020.payload.request.LoginRequest;
import ro.tuc.ds2020.payload.request.SignupRequest;
import ro.tuc.ds2020.payload.response.JwtResponse;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.ActivationTokenRepository;
import ro.tuc.ds2020.repositories.RoleRepository;
import ro.tuc.ds2020.repositories.UserRepository;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")

public class AuthController {

	private final AuthenticationManager authenticationManager;

	private final UserRepository userRepository;

	private final RoleRepository roleRepository;

	private final ActivationTokenRepository activationTokenRepository;

	private final PasswordEncoder encoder;

	private final JwtUtils jwtUtils;

	private final EmailServiceImpl emailService;

	private final AmazonS3 s3client;

	@Value("${app.awsServices.bucketName}")
	private String bucketName;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder, JwtUtils jwtUtils, EmailServiceImpl emailService, AmazonS3 s3client, ActivationTokenRepository activationTokenRepository){
		this.emailService=emailService;
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.encoder = encoder;
		this.jwtUtils = jwtUtils;
		this.s3client = s3client;
		this.activationTokenRepository = activationTokenRepository;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());

		User user = userRepository.findByUsername(loginRequest.getUsername()).get();

		if(!user.isActivate()){
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: The account is not activated!"));
		}


		String encodedString = getBase64StringFromImagePath(userDetails.getPhoto());

		return ResponseEntity.ok(new JwtResponse(jwt,
												 userDetails.getId(), 
												 userDetails.getUsername(),
												 userDetails.getEmail(),
												 userDetails.getName(),
												 userDetails.getBirthDate(),
												 userDetails.getGender(),
												 userDetails.getCountry(),
												 userDetails.getState(),
												 userDetails.getCity(),
												 userDetails.getAddress(),
												 roles,
												 jwtUtils.getJwtExpirationMs(),
												 encodedString));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws IOException {

		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.status(401)
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

		Set<Role> roles = new HashSet<>();
		Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		roles.add(userRole);
		userRole.getUsers().add(user);
		roleRepository.save(userRole);


		user.setRoles(roles);
		userRepository.save(user);

		String token = UUID.randomUUID().toString();

		while(activationTokenRepository.findByToken(token)!=null){
			token = UUID.randomUUID().toString();
		}

		ActivationToken activationToken = new ActivationToken(user, token);

		activationTokenRepository.save(activationToken);

		String message = "<a href=\"https://frontendbarbershop.herokuapp.com/activate/" + token + "\">Link</a>.";

		emailService.sendSimpleMessage(signUpRequest.getEmail(), signUpRequest.getSubject(), signUpRequest.getMessage() + message);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
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
}
