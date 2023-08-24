package learn.petsitter.controllers;

import learn.petsitter.domain.AppUserService;
import learn.petsitter.domain.CareVisitService;
import learn.petsitter.domain.Result;
import learn.petsitter.domain.ResultType;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.CareVisit;
import learn.petsitter.models.Pet;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//TODO what should be the endpoints for updating and deleting a visit?
//also i tried to make delete an update under the hood that just makes the status cancelled

@RestController
@RequestMapping("/api/visit")
@CrossOrigin
public class CareVisitController {
    private final CareVisitService service;
    private final AppUserService appUserService;

    public CareVisitController(CareVisitService service, AppUserService appUserService) {
        this.service = service;
        this.appUserService = appUserService;
    }

    @GetMapping("/owner/my-visits")
    public List<CareVisit> findByOwnerToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        int ownerId = appUser.getAppUserId();
        return service.findByOwnerId(ownerId);
    }

    @GetMapping("/sitter/my-visits")
    public List<CareVisit> findBySitterToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        int sitterId = appUser.getAppUserId();
        return service.findBySitterId(sitterId);
    }


    @GetMapping("/singlevisit/{careVisitId}")
    public ResponseEntity<CareVisit> findById(@PathVariable int careVisitId) {

        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        int userId = appUser.getAppUserId();

        if (!service.isUserAssociatedWithCareVisit(userId, careVisitId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403 Forbidden
        }

        CareVisit cv = service.findById(careVisitId);
        if (cv == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(cv, HttpStatus.OK);
    }
    //TODO how is the sitter going to be set? User can designate on the form (minimally we can show the number corresponding to their id and take in the id?
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody CareVisit cv) {

        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        cv.setOwnerId(appUser.getAppUserId());
        System.out.println(cv.getTimeOfDay());

        Result<CareVisit> result = service.create(cv);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }



        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/singlevisit/{careVisitId}")
    public ResponseEntity<?> update(@PathVariable int careVisitId, @RequestBody CareVisit cv) {
        if (careVisitId != cv.getCareVisitId()) {
            System.out.println("Path Var careVisitId: " + careVisitId);
            System.out.println("cv.getCareVisitId: " + cv.getCareVisitId());
            return new ResponseEntity<>(HttpStatus.CONFLICT); //409
        }

        Result<CareVisit> result = service.update(cv);
        if (!result.isSuccess()) {
            if (result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); //404
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST); //400
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204
    }

    @DeleteMapping("/singlevisit/{careVisitId}")
    public ResponseEntity<?> delete(@PathVariable int careVisitId, @RequestBody CareVisit cv) {
        if (careVisitId != cv.getCareVisitId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); //409
        }

        Result<CareVisit> result = service.delete(cv);
        if (!result.isSuccess()) {
            if (result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); //404
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST); //400
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204
    }
}
