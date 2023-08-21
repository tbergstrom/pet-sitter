package learn.petsitter.controllers;

import learn.petsitter.models.AppUser;
import learn.petsitter.domain.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
