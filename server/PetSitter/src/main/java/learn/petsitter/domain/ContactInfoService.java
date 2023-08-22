package learn.petsitter.domain;

import learn.petsitter.data.ContactInfoRepository;
import learn.petsitter.models.ContactInfo;
import learn.petsitter.models.Pet;
import org.springframework.stereotype.Service;

@Service
public class ContactInfoService {
    private final ContactInfoRepository repository;

    public ContactInfoService(ContactInfoRepository repository) {
        this.repository = repository;
    }

    public ContactInfo findById(int contactInfoId) {
        return repository.findById(contactInfoId);
    }

    public ContactInfo findByAppUserId(int appUserId) {
        return repository.findByAppUserId(appUserId);
    }

    public Result<ContactInfo> create(ContactInfo contactInfo) {
        Result<ContactInfo> result = validate(contactInfo);
        if(!result.isSuccess()) {
            return result;
        }

        if (contactInfo.getContactInfoId() != 0) {
            result.addErrorMessage("contact info id cannot be set for 'create' operation in service", ResultType.INVALID);
            return result;
        }

        contactInfo = repository.create(contactInfo);
        result.setPayload(contactInfo);
        return result;
    }

    public Result<ContactInfo> update(ContactInfo contactInfo) {
        Result<ContactInfo> result = validate(contactInfo);

        if (contactInfo.getContactInfoId() <= 0) {
            result.addErrorMessage("Contact info id is required in service update method", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(contactInfo)) {
                result.setPayload(contactInfo);
            } else {
                result.addErrorMessage("Contact info id %s was not found in service update method", ResultType.NOT_FOUND, contactInfo.getContactInfoId());
            }
        }

        return result;
    }

    public Result<ContactInfo> deleteById(int id) {
        Result<ContactInfo> result = new Result<>();

        if(!repository.deleteById(id)) {
            result.addErrorMessage("Contact id %s was not found", ResultType.NOT_FOUND, id);
        }

        return result;
    }



    public Result<ContactInfo> validate(ContactInfo contactInfo) {
        Result<ContactInfo> result = new Result<>();


        if (contactInfo == null) {
            result.addErrorMessage("contactInfo cannot be null in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getFirstName() == null || contactInfo.getFirstName().isBlank()) {
            result.addErrorMessage("contactInfo first name is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getLastName() == null || contactInfo.getLastName().isBlank()) {
            result.addErrorMessage("contactInfo last name is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getEmail() == null || contactInfo.getEmail().isBlank()) {
            result.addErrorMessage("contactInfo email is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getPhoneNumber() == null || contactInfo.getPhoneNumber().isBlank()) {
            result.addErrorMessage("contactInfo phone number is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getStreetAddress() == null || contactInfo.getStreetAddress().isBlank()) {
            result.addErrorMessage("contactInfo street address is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getCity() == null || contactInfo.getCity().isBlank()) {
            result.addErrorMessage("contactInfo city is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getState() == null || contactInfo.getState().isBlank()) {
            result.addErrorMessage("contactInfo state is required in service", ResultType.INVALID);
            return result;
        }

        if (contactInfo.getZipCode() == null || contactInfo.getZipCode().isBlank()) {
            result.addErrorMessage("contactInfo zipcode is required in service", ResultType.INVALID);
            return result;
        }

        return result;
    }
}
