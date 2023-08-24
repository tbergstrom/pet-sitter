package learn.petsitter.domain;

import learn.petsitter.App;
import learn.petsitter.data.AppUserRepository;
import learn.petsitter.data.ContactInfoRepository;
import learn.petsitter.domain.ResultType;
import learn.petsitter.domain.Result;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.ContactInfo;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AppUserService implements UserDetailsService {

    private final AppUserRepository repository;
    private final ContactInfoRepository contactInfoRepository;
    private final PasswordEncoder encoder;

    public AppUserService(AppUserRepository repository, ContactInfoRepository contactInfoRepository,
                          PasswordEncoder encoder) {
        this.repository = repository;
        this.contactInfoRepository = contactInfoRepository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = repository.findByUsername(username);
        //TODO is this where a contactId object should get set?
        ContactInfo contactInfo = contactInfoRepository.findByAppUserId(appUser.getAppUserId());
        appUser.setContactInfo(contactInfo);

        if (appUser == null || !appUser.isEnabled()) {
            throw new UsernameNotFoundException(username + " not found");
        }

        return appUser;
    }

    public Result<AppUser> create(String username, String password, List<String> roles) {
        Result<AppUser> result = validate(username, password);
        if (!result.isSuccess()) {
            return result;
        }

        password = encoder.encode(password);

        AppUser existingUser = repository.findByUsername(username);

        if(existingUser != null) {
            result.addErrorMessage("Username already exists", ResultType.INVALID);
            return result;
        }

        AppUser appUser = new AppUser(0, username, password, true, 0, roles);

        try {
            appUser = repository.create(appUser);

        } catch (DuplicateKeyException ex) {
            result.addErrorMessage("Unable to create user: " + ex.getMessage(), ResultType.INVALID);
            return result;
        }

        ContactInfo ci = new ContactInfo();
        ci.setFirstName("");
        ci.setLastName("");
        ci.setEmail("");
        ci.setPhoneNumber("");
        ci.setStreetAddress("");
        ci.setCity("");
        ci.setState("");
        ci.setZipCode("");
        ci.setLatitude(0.0);
        ci.setLongitude(0.0);
        ci.setAppUserId(appUser.getAppUserId());
        ContactInfo contactInfo = contactInfoRepository.create(ci);
        appUser.setContactInfo(contactInfo);

        Result<AppUser> resultAppUser = new Result<>();

        resultAppUser.setPayload(appUser);
        return resultAppUser;
    }

    public Result<AppUser> createGoogleUser(String email, List<String> roles) {
        Result <AppUser> result = validateGoogleUser(email);
        if (!result.isSuccess()) {
            return result;
        }

        AppUser existingUser = repository.findByUsername(email);

        if(existingUser != null){
            result.addErrorMessage("Email already exists", ResultType.INVALID);
            return result;
        }

        AppUser googleUser = new AppUser(0, email, true, 0, roles);

        try {
            googleUser = repository.createGoogleUser(googleUser);
        } catch (Exception ex) {
            result.addErrorMessage("Unable to create user: " + ex.getMessage(), ResultType.INVALID);
            return result;
        }

        ContactInfo ci = new ContactInfo();
        ci.setFirstName("");
        ci.setLastName("");
        ci.setEmail("");
        ci.setPhoneNumber("");
        ci.setStreetAddress("");
        ci.setCity("");
        ci.setState("");
        ci.setZipCode("");
        ci.setLatitude(0.0);
        ci.setLongitude(0.0);
        ci.setAppUserId(googleUser.getAppUserId());
        ContactInfo contactInfo = contactInfoRepository.create(ci);
        googleUser.setContactInfo(contactInfo);

        Result<AppUser> resultGoogleUser = new Result<>();
        resultGoogleUser.setPayload(googleUser);
        return resultGoogleUser;
    }

    private Result<AppUser> validate(String username, String password) {
        Result<AppUser> result = new Result<>();
        if (username == null || username.isBlank()) {
            result.addErrorMessage("username is required", ResultType.INVALID);
            return result;
        }

        if (password == null) {
            result.addErrorMessage("password is required", ResultType.INVALID);
            return result;
        }

        if (username.length() > 50) {
            result.addErrorMessage("username must be less than 50 characters", ResultType.INVALID);
        }

        if (!isValidPassword(password)) {
            result.addErrorMessage(
                    "password must be at least 8 character and contain a digit," +
                            " a letter, and a non-digit/non-letter", ResultType.INVALID);
        }

        return result;
    }

    private Result<AppUser> validateGoogleUser(String email) {
        Result<AppUser> result = new Result<>();
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";


        if (email == null || email.isBlank() || email.isEmpty()) {
            result.addErrorMessage("Email is required", ResultType.INVALID);
            return result;
        }

        if (!email.matches(emailRegex)) {
            result.addErrorMessage("Invalid email", ResultType.INVALID);
            return result;
        }

        if (email.length() > 50) {
            result.addErrorMessage("username must be less than 50 characters", ResultType.INVALID);
            return result;
        }
        return result;
    }

    public List<AppUser> getAllSittersFromRepository() {
         return repository.getAllSitters();
    }

    public List<AppUser> getAllOwnersFromRepository() {
         return repository.getAllOwners();
    }

    public List<AppUser> getNearbySitters(double lat, double lng, double distance) {

        return repository.findNearbySitters(lat,lng, distance);
    }

    private boolean isValidPassword(String password) {
        if (password.length() < 8) {
            return false;
        }

        int digits = 0;
        int letters = 0;
        int others = 0;
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                digits++;
            } else if (Character.isLetter(c)) {
                letters++;
            } else {
                others++;
            }
        }

        return digits > 0 && letters > 0 && others > 0;
    }

    public AppUser findById(int userId) {
        AppUser appUser = repository.findById(userId);
        if (appUser != null) {
            ContactInfo contactInfo = contactInfoRepository.findByAppUserId(appUser.getAppUserId());
            appUser.setContactInfo(contactInfo);
        }
        return appUser;
    }

}



