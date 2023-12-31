package learn.petsitter.domain;

import learn.petsitter.data.AppUserJdbcTemplateRepository;
import learn.petsitter.data.CareVisitRepository;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.CareVisit;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CareVisitService {
    private final CareVisitRepository repository;
    private final AppUserJdbcTemplateRepository appUserJdbcTemplateRepository;

    public CareVisitService(CareVisitRepository repository, AppUserJdbcTemplateRepository appUserJdbcTemplateRepository) {
        this.repository = repository;
        this.appUserJdbcTemplateRepository = appUserJdbcTemplateRepository;
    }


    public List<CareVisit> findByOwnerId(int ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    public List<CareVisit> findBySitterId(int sitterId) {
        return repository.findBySitterId(sitterId);
    }

    public CareVisit findById(int careVisitId) {
        return repository.findById(careVisitId);
    }

    public Result<CareVisit> create(CareVisit cv) {
        Result<CareVisit> result = validate(cv);
        if(!result.isSuccess()) {
            return result;
        }

        if (cv.getCareVisitId() != 0) {
            result.addErrorMessage("care visit Id cannot be set for 'create' operation in service", ResultType.INVALID);
            return result;
        }

        long daysDifference = ChronoUnit.DAYS.between(cv.getStartDate(), cv.getEndDate());
        AppUser careVisitSitter = appUserJdbcTemplateRepository.findById(cv.getSitterId());
        BigDecimal sitterRate = careVisitSitter.getRate();
        BigDecimal calculatedCost = sitterRate.multiply(new BigDecimal(daysDifference + 1));

        //TODO decide if this is the best place to set the initial status
        cv.setStatus("Pending");
        cv.setCost(calculatedCost);
        cv = repository.create(cv);
        result.setPayload(cv);
        return result;
    }

    public Result<CareVisit> update(CareVisit cv) {
        Result<CareVisit> result = validate(cv);

        if (cv.getCareVisitId() <= 0) {
            result.addErrorMessage("Care visit id is required in service update method", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(cv)) {
                result.setPayload(cv);
            } else {
                result.addErrorMessage("Care Visit id %s was not found in service update method", ResultType.NOT_FOUND, cv.getCareVisitId());
            }
        }

        return result;
    }

    public Result<CareVisit> delete(CareVisit cv) {
        Result<CareVisit> result = validate(cv);
        cv.setStatus("Cancelled");

        if (cv.getCareVisitId() <= 0) {
            result.addErrorMessage("Care visit id is required in service delete method", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(cv)) {
                result.setPayload(cv);
            } else {
                result.addErrorMessage("Care Visit id %s was not found in service delete method", ResultType.NOT_FOUND, cv.getCareVisitId());
            }
        }

        return result;
    }

    public Result<CareVisit> validate(CareVisit cv) {
        Result<CareVisit> result = new Result<>();

        if (cv == null) {
            result.addErrorMessage("care visit cannot be null in service", ResultType.INVALID);
            return result;
        }

        if (cv.getStartDate() == null) {
            result.addErrorMessage("start date is required in service", ResultType.INVALID);
            return result;
        }

        if (cv.getEndDate() == null) {
            result.addErrorMessage("end date is required in service", ResultType.INVALID);
            return result;
        }

        if (cv.getTimeOfDay() == null) {
            result.addErrorMessage("time of day is required in service", ResultType.INVALID);
            return result;
        }

        if (cv.getCost() == null) {
            result.addErrorMessage("cost is required in service", ResultType.INVALID);
            return result;
        }

        if (cv.getOwnerId() == 0) {
            result.addErrorMessage("care visit ownerID required in service", ResultType.INVALID);
            return result;
        }

        if (cv.getSitterId() == 0) {
            result.addErrorMessage("care visit sitterID required in service", ResultType.INVALID);
            return result;
        }

        return result;
    }

        public boolean isUserAssociatedWithCareVisit(int userId, int careVisitId) {
            CareVisit careVisit = repository.findById(careVisitId);
            if (careVisit == null) {
                return false;
            }
        return careVisit.getOwnerId() == userId || careVisit.getSitterId() == userId;
    }


}
