package learn.petsitter.controllers;

import learn.petsitter.models.AppUser;
import learn.petsitter.domain.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
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
    public List<AppUser> getNearbySitters(@RequestParam double lat, @RequestParam double lng) {
        System.out.println("In controller, trying to find nearby sitters");
        return appUserService.getNearbySitters(lat, lng);
    }

}
