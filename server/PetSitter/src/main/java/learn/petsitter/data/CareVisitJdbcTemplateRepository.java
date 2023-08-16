package learn.petsitter.data;

import learn.petsitter.models.CareVisit;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CareVisitJdbcTemplateRepository implements CareVisitRepository{
    @Override
    public List<CareVisit> findByOwnerId(int ownerId) {
        return null;
    }

    @Override
    public List<CareVisit> findBySitterId(int sitterId) {
        return null;
    }

    @Override
    public CareVisit findById(int id) {
        return null;
    }

    @Override
    public CareVisit create(CareVisit careVisit) {
        return null;
    }

    @Override
    public boolean update(CareVisit careVisit) {
        return false;
    }

    @Override
    public boolean deleteById(int id) {
        return false;
    }
}
