package learn.petsitter.controllers;


import learn.petsitter.domain.AppUserService;
import learn.petsitter.domain.ContactInfoService;
import learn.petsitter.domain.Result;
import learn.petsitter.domain.ResultType;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.ContactInfo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-info")
@CrossOrigin
public class ContactInfoController {
    private final ContactInfoService service;
    private final AppUserService appUserService;

    public ContactInfoController(ContactInfoService service, AppUserService appUserService) {
        this.service = service;
        this.appUserService = appUserService;
    }

    @GetMapping("/{contactInfoId}")
    public ResponseEntity<ContactInfo> findById(@PathVariable int contactInfoId) {
        ContactInfo contactInfo = service.findById(contactInfoId);
        if (contactInfo == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(contactInfo, HttpStatus.OK);
    }

    @GetMapping("/user/my-info")
    public ResponseEntity<ContactInfo> findByAppUserToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        int userId = appUser.getAppUserId();

        ContactInfo contactInfo = service.findByAppUserId(userId);
        if (contactInfo == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(contactInfo, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ContactInfo contactInfo) {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        //add appUser field to contact info
        //in microstack we just set the id not the user object
        //look into this if errors happen
        contactInfo.setAppUserId(appUser.getAppUserId());

        Result<ContactInfo> result = service.create(contactInfo);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{contactInfoId}")
    public ResponseEntity<?> update(@PathVariable int contactInfoId, @RequestBody ContactInfo contactInfo) {
        if (contactInfoId != contactInfo.getContactInfoId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); //409
        }

        Result<ContactInfo> result = service.update(contactInfo);
        if (!result.isSuccess()) {
            if (result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); //404
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST); //400
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204
    }

    @DeleteMapping("/{contactInfoId}")
    public ResponseEntity<Void> delete(@PathVariable int contactInfoId) {
        Result<ContactInfo> result = service.deleteById(contactInfoId);
        if (result.getResultType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
    }




}
