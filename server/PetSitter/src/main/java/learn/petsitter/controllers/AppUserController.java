package learn.petsitter.controllers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import learn.petsitter.models.AppUser;
import learn.petsitter.domain.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PostMapping("/update-pfp")
    public String updateProfilePic(@RequestParam("pfpUrl") String pfpUrl, Principal principal) {
        String username = principal.getName();

        appUserService.updateProfilePicture(username, pfpUrl);
        return "redirect:/";
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

    @GetMapping("/nearby-sitters")
    public List<AppUser> getNearbySitters(@RequestParam double lat, @RequestParam double lng, @RequestParam double distance) {
        return appUserService.getNearbySitters(lat, lng, distance);
    }

    @GetMapping("/user/{userId}")
    public AppUser getUserById(@PathVariable int userId) {
        return appUserService.findById(userId);
    }




}
