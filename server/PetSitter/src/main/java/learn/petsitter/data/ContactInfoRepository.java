package learn.petsitter.data;

import learn.petsitter.models.ContactInfo;

public interface ContactInfoRepository {

    ContactInfo findById(int id);

    ContactInfo findByAppUserId(int appUserId);

    ContactInfo create(ContactInfo contactInfo);

    boolean update(ContactInfo contactInfo);

    boolean deleteById(int id);
}
