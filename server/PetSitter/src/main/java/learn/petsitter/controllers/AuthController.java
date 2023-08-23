package learn.petsitter.controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import learn.petsitter.domain.AppUserService;
import learn.petsitter.domain.Result;
import learn.petsitter.models.AppUser;
import learn.petsitter.security.JwtConverter;
import org.springframework.beans.factory.annotation.Value;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;
    private final AppUserService appUserService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Value("${GOOGLE_CLIENT_ID}")
    private String CLIENT_ID;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtConverter converter,
                          AppUserService appUserService) {
        this.authenticationManager = authenticationManager;
        this.converter = converter;
        this.appUserService = appUserService;
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

    @PostMapping("/authenticate-google")
    public ResponseEntity<Map<String, String>> authenticateGoogle(@RequestBody Map<String, String> credentials) {

        String tokenId = credentials.get("tokenId");
        String role = credentials.get("role");

        GoogleIdToken.Payload payload = verifyToken(tokenId);
        if(payload == null) {
            return new ResponseEntity<>(Map.of("Error", "Invalid token"), HttpStatus.BAD_REQUEST);
        }

        String email = payload.getEmail();

        AppUser user = (AppUser) appUserService.loadUserByUsername(email);

        if (user == null) {
            Result<AppUser> result = appUserService.createGoogleUser(email, List.of(role));

            if(!result.isSuccess()) {

                Map<String, String> errorMap = new HashMap<>();

                for (int i = 0; i < result.getErrorMessages().size(); i++) {
                    errorMap.put("error" + (i+1), result.getErrorMessages().get(i));
                }
                return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
            }

            user = result.getPayload();
        }

        String jwtToken = converter.getTokenFromUser(user);

        HashMap<String, String> map = new HashMap<>();
        map.put("jwt_token", jwtToken);

        return new ResponseEntity<>(map, HttpStatus.OK);

    }

    @PostMapping("/create-account")
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

    // create_account_google uses Google to create an account. It does not use a password. It uses the createGoogleUser from
    // appUserService.
    // We may need to create a similar flow for login, since the normal login method will try to look for a password.
    // The password_hash field in the DB now accepts null to account for this.
    @PostMapping("/create-account-google")
    public ResponseEntity<?> createAccountGoogle(@RequestBody Map<String, String> credentials) throws Exception {

        String role = credentials.get("role");
        String tokenId = credentials.get("tokenId");

        if (tokenId == null) {
            return new ResponseEntity<>(Map.of("Error", "TokenId is missing"), HttpStatus.BAD_REQUEST);
        }

        GoogleIdToken.Payload payload = verifyToken(tokenId);

        if (payload == null) {
            return new ResponseEntity<>(Map.of("Error", "Invalid token"), HttpStatus.BAD_REQUEST);
        }

        String email = payload.getEmail();

        Result<AppUser> result = appUserService.createGoogleUser(email, List.of(role));
        if(!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        HashMap<String, Integer> map = new HashMap<>();
        map.put("appUserId", result.getPayload().getAppUserId());

        return new ResponseEntity<>(map, HttpStatus.CREATED);

    }

    private GoogleIdToken.Payload verifyToken(String tokenId) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(tokenId);
            if(idToken != null) {
                return idToken.getPayload();
            }
        }catch (AuthenticationException | GeneralSecurityException | IOException ex) {
            logger.error("Authentication failed.", ex);
        }
        return null;
    }
}
