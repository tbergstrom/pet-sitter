package learn.petsitter.domain;

import learn.petsitter.data.AppUserRepository;
import learn.petsitter.data.ContactInfoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


@Service
public class GoogleAuthService {

    private final AppUserRepository repository;
    private final ContactInfoRepository contactInfoRepository;
    private final PasswordEncoder encoder;

    public GoogleAuthService(AppUserRepository repository, ContactInfoRepository contactInfoRepository, PasswordEncoder encoder) {
        this.repository = repository;
        this.contactInfoRepository = contactInfoRepository;
        this.encoder = encoder;
    }

    @Value("${GOOGLE_CLIENT_ID}")
    private String CLIENT_ID;

    @Value("${GOOGLE_CLIENT_SECRET}")
    private String CLIENT_SECRET;

    @Value("${GOOGLE_REDIRECT_URI_PRODUCTION}")
    private String REDIRECT_URI_PROD;

    @Value("${GOOGLE_REDIRECT_URI_DEVELOPMENT}")
    private String REDIRECT_URI_DEV;

    private final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private final String USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    private RestTemplate restTemplate = new RestTemplate();

    public String getAccessToken(String authCode) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("code", authCode);
        formData.add("client_id", "321605181263-7tsniamk1f3712hs4p6uc26dvshbv46k.apps.googleusercontent.com");
        formData.add("client_secret", "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");
        formData.add("redirect_uri", "http://localhost:3000"); // might have to change to the PROD version if deployed.
        formData.add("grant_type", "authorization_code");

        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(TOKEN_URL, request, Map.class);
            return (response.getBody().get("access_token")).toString();
        } catch (Exception ex) {
            if (ex instanceof HttpClientErrorException) {
                HttpClientErrorException httpClientEx = (HttpClientErrorException) ex;
                System.out.println("Google Response: " + httpClientEx.getResponseBodyAsString());
            }
            ex.printStackTrace();
            return null;
        }
    }

    public String getGoogleEmail(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(USERINFO_URL, HttpMethod.GET, entity, Map.class);
            return (response.getBody().get("email")).toString();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }


}
