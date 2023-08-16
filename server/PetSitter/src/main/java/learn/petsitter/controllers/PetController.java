package learn.petsitter.controllers;

import learn.petsitter.domain.PetService;
import learn.petsitter.models.Pet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin
public class PetController {
    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    @GetMapping("/{ownerId}")
    public List<Pet> findByOwnerId(@PathVariable int ownerId) {
        return service.findByUserId(ownerId);
    }

//    @GetMapping("/pet/{petId}")
//    public ResponseEntity<Pet> findbyId(@PathVariable int petId) {
//        Pet pet = service.findById(petId);
//
//    }


}
