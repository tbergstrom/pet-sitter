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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;
    private final AppUserService appUserService;

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
//    appUserService.

//    We may need to create a similar flow for login, since the normal login method will try to look for a password.

//    The password_hash field in the DB now accepts null to account for this.
    @PostMapping("/create_account_google")
    public ResponseEntity<?> createAccountGoogle(@RequestBody Map<String, String> credentials) throws Exception {

        String role = credentials.get("role");
        String tokenId = credentials.get("tokenId");

        if (tokenId == null) {
            return new ResponseEntity<>(Map.of("error", "TokenId is missing"), HttpStatus.BAD_REQUEST);
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(tokenId);

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();

            Result<AppUser> result = appUserService.createGoogleUser(email, List.of(role));
            if(!result.isSuccess()) {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
            }

            HashMap<String, Integer> map = new HashMap<>();
            map.put("appUserId", result.getPayload().getAppUserId());

            return new ResponseEntity<>(map, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(Map.of("error", "Invalid token"), HttpStatus.BAD_REQUEST);
        }
    }
}
