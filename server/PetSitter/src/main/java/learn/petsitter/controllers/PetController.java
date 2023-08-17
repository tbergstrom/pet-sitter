package learn.petsitter.controllers;

import learn.petsitter.domain.AppUserService;
import learn.petsitter.domain.PetService;
import learn.petsitter.domain.Result;
import learn.petsitter.domain.ResultType;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.Pet;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin
public class PetController {
    private final PetService service;
    private final AppUserService appUserService;

    public PetController(PetService service, AppUserService appUserService) {
        this.service = service;
        this.appUserService = appUserService;
    }

    @GetMapping("/{ownerId}")
    public List<Pet> findByOwnerId(@PathVariable int ownerId) {
        return service.findByUserId(ownerId);
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<Pet> findbyId(@PathVariable int petId) {
        Pet pet = service.findById(petId);
        if (pet == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(pet, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Pet pet) {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        pet.setOwnerId(appUser.getAppUserId());

        Result<Pet> result = service.create(pet);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/pet/{petId}")
    public ResponseEntity<?> update(@PathVariable int petId, @RequestBody Pet pet) {
        if (petId != pet.getPetId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); //409
        }

        Result result = service.update(pet);
        if (!result.isSuccess()) {
            if (result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); //404
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST); //400
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204
    }

    @DeleteMapping("/pet/{petId}")
    public ResponseEntity<Void> delete(@PathVariable int petId) {
        Result<Pet> result = service.deleteById(petId);
        if (result.getResultType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
    }


}
