package learn.petsitter.controllers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import learn.petsitter.domain.Result;
import learn.petsitter.domain.ResultType;
import learn.petsitter.models.AppUser;
import learn.petsitter.domain.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PutMapping("/update-pfp")
    public ResponseEntity<?> updateProfilePic(@RequestBody Map<String, String> requestBody, Principal principal) {

        String pfpUrl = requestBody.get("pfpUrl");
        String username = principal.getName();

        Result<AppUser> result = appUserService.updateProfilePicture(username, pfpUrl);
        if(!result.isSuccess()) {
            if(result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all-sitters")
    public List<AppUser> getAllSitters() {
        return appUserService.getAllSittersFromRepository();
    }

    @GetMapping("/all-owners")
    public List<AppUser> getAllOwners() {
        return appUserService.getAllOwnersFromRepository();
    }

    @GetMapping("/sitter/{username}")
    public AppUser getSitterByUsername(@PathVariable String username) {
        return (AppUser) appUserService.loadUserByUsername(username);
    }

    @GetMapping("/owner/{username}")
    public AppUser getOwnerByUsername(@PathVariable String username) {
        return (AppUser) appUserService.loadUserByUsername(username);
    }

    @GetMapping("/my-info")
    public ResponseEntity<AppUser> findByAppUserToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);

        if(appUser == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(appUser, HttpStatus.OK);
    }

    @GetMapping("/nearby-sitters")
    public List<AppUser> getNearbySitters(@RequestParam double lat, @RequestParam double lng, @RequestParam double distance) {

//        List<AppUser> listOfSitters = appUserService.getNearbySitters(lat, lng, distance);

//        for (AppUser sitter: listOfSitters
//             ) {
//            System.out.println(sitter.getPfpUrl());
//        }


        return appUserService.getNearbySitters(lat, lng, distance);
    }

    @GetMapping("/user/{userId}")
    public AppUser getUserById(@PathVariable int userId) {
        return appUserService.findById(userId);
    }




}
