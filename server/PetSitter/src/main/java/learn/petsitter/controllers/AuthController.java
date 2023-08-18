package learn.petsitter.controllers;

import learn.petsitter.domain.AppUserService;
import learn.petsitter.domain.GoogleAuthService;
import learn.petsitter.domain.Result;
import learn.petsitter.models.AppUser;
import learn.petsitter.security.JwtConverter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.ResourceUrlProviderExposingInterceptor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;
    private final AppUserService appUserService;
    private final GoogleAuthService googleAuthService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtConverter converter,
                          AppUserService appUserService, GoogleAuthService googleAuthService) {
        this.authenticationManager = authenticationManager;
        this.converter = converter;
        this.appUserService = appUserService;
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> credentials) {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"));

        try {
            Authentication authentication = authenticationManager.authenticate(authToken);

            if (authentication.isAuthenticated()) {
                String jwtToken = converter.getTokenFromUser((UserDetails) authentication.getPrincipal());

                HashMap<String, String> map = new HashMap<>();
                map.put("jwt_token", jwtToken);

                return new ResponseEntity<>(map, HttpStatus.OK);
            }

        } catch (AuthenticationException ex) {
            System.out.println(ex);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/create_account")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");
        String role = credentials.get("role");

        Result<AppUser> result = appUserService.create(username, password, List.of(role));

        // unhappy path...
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        // happy path...
        HashMap<String, Integer> map = new HashMap<>();
        map.put("appUserId", result.getPayload().getAppUserId());

        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }

//    create_account_g uses Google to create an account. It does not use a password. It uses the createGoogleUser from
//    appUserService, and it uses two methods from googleAuthService: 1 to get the token and 1 to get the user's email.
//    This is done via HTTP request from the backend to the Google server in GoogleAuthService.java.

//    We may need to create a similar flow for login, since the normal login method will try to look for a password.

//    The password_hash field in the app_user table will have to be set to "nullable" to allow for the Google users.
    @PostMapping("/create_account_g")
    public ResponseEntity<?> createAccountGoogle(@RequestBody Map<String, String> credentials) throws Exception {

        System.out.println("In AuthController ");

        String authCode = credentials.get("credential");
        String role = credentials.get("role");
        String accessToken = googleAuthService.getAccessToken(authCode); // implement

        System.out.println("AuthCode: " + authCode);
        System.out.println("Access token: " + accessToken);

        if(accessToken == null) {
            return new ResponseEntity<>("Failed to retrieve access token from Google", HttpStatus.BAD_REQUEST);
        }

        String email = googleAuthService.getGoogleEmail(accessToken);

        if(email == null) {
            return new ResponseEntity<>("Failed to fetch token from Google server", HttpStatus.BAD_REQUEST);
        }

        Result<AppUser> result = appUserService.createGoogleUser(email, List.of(role)); // implement
        if(!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        HashMap<String, Integer> map = new HashMap<>();
        map.put("appUserId", result.getPayload().getAppUserId());

        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }
}
