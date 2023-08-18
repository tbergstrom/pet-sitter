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

    @GetMapping("/owner/{ownerId}")
    public List<CareVisit> findByOwnerId(@PathVariable int ownerId) {
        return service.findByOwnerId(ownerId);
    }

    @GetMapping("/sitter/{sitterId}")
    public List<CareVisit> findBySitterId(@PathVariable int sitterId) {
        return service.findBySitterId(sitterId);
    }


    @GetMapping("/singlevisit/{careVisitId}")
    public ResponseEntity<CareVisit> findById(@PathVariable int careVisitId) {
        CareVisit cv = service.findById(careVisitId);
        if (cv == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(cv, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody CareVisit cv) {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        cv.setOwnerId(appUser.getAppUserId());

        Result<CareVisit> result = service.create(cv);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/single/{careVisitId}")
    public ResponseEntity<?> update(@PathVariable int careVisitId, @RequestBody CareVisit cv) {
        if (careVisitId != cv.getCareVisitId()) {
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

    @DeleteMapping("/single/{careVisitId}")
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
