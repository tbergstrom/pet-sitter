package learn.petsitter.data;

import learn.petsitter.models.CareVisit;

import java.util.List;

public interface CareVisitRepository {

    List<CareVisit> findByOwnerId(int ownerId);

    List<CareVisit> findBySitterId(int sitterId);

    CareVisit findById(int id);

    CareVisit create(CareVisit careVisit);

    boolean update(CareVisit careVisit);

    boolean delete(CareVisit careVisit);

}
