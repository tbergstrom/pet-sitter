package learn.petsitter.data;

import learn.petsitter.models.ContactInfo;
import org.springframework.stereotype.Repository;

@Repository
public class ContactInfoJdbcTemplateRepository implements ContactInfoRepository{
    @Override
    public ContactInfo findById(int id) {
        return null;
    }

    @Override
    public ContactInfo findByAppUserId(int appUserId) {
        return null;
    }

    @Override
    public ContactInfo create(ContactInfo contactInfo) {
        return null;
    }

    @Override
    public boolean update(ContactInfo contactInfo) {
        return false;
    }

    @Override
    public boolean deleteById(int id) {
        return false;
    }
}
