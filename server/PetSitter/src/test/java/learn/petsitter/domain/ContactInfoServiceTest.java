package learn.petsitter.domain;

import learn.petsitter.data.ContactInfoRepository;
import learn.petsitter.models.ContactInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;


import static org.junit.jupiter.api.Assertions.*;


import static org.mockito.Mockito.*;

@SpringBootTest()
class ContactInfoServiceTest {
    @Autowired
    ContactInfoService service;

    @MockBean
    ContactInfoRepository repository;

    @Test
    void findById() {
        when(repository.findById(1)).thenReturn(new ContactInfo());
        ContactInfo contactInfo = service.findById(1);
        assertNotNull(contactInfo);

    }

    @Test
    void findByAppUserId() {
        when(repository.findByAppUserId(1)).thenReturn(new ContactInfo());
        ContactInfo contactInfo = service.findByAppUserId(1);
        assertNotNull(contactInfo);
    }

    @Test
    void shouldNotUpdateNullLastName() {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setContactInfoId(4);
        contactInfo.setFirstName("Parrot");
        contactInfo.setLastName(null);
        contactInfo.setEmail("ph@bird.net");
        contactInfo.setPhoneNumber("123-456-7890");
        contactInfo.setStreetAddress("547 Aviary Place");
        contactInfo.setCity("Any Town");
        contactInfo.setState("MT");
        contactInfo.setZipCode("60646");


        Result<ContactInfo> result = service.update(contactInfo);
        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().size(), 1);
        assertTrue(result.getErrorMessages().get(0).contains("last name"));

    }

    @Test
    void shouldNotUpdateNullFirstName() {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setContactInfoId(4);
        contactInfo.setFirstName(null);
        contactInfo.setLastName("Haver");
        contactInfo.setEmail("ph@bird.net");
        contactInfo.setPhoneNumber("123-456-7890");
        contactInfo.setStreetAddress("547 Aviary Place");
        contactInfo.setCity("Any Town");
        contactInfo.setState("MT");
        contactInfo.setZipCode("60646");


        Result<ContactInfo> result = service.update(contactInfo);
        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().size(), 1);
        assertTrue(result.getErrorMessages().get(0).contains("first name"));

    }

    @Test
    void shouldNotUpdateNullEmail() {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setContactInfoId(4);
        contactInfo.setFirstName("Parrot");
        contactInfo.setLastName("Haver");
        contactInfo.setEmail(null);
        contactInfo.setPhoneNumber("123-456-7890");
        contactInfo.setStreetAddress("547 Aviary Place");
        contactInfo.setCity("Any Town");
        contactInfo.setState("MT");
        contactInfo.setZipCode("60646");


        Result<ContactInfo> result = service.update(contactInfo);
        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().size(), 1);
        assertTrue(result.getErrorMessages().get(0).contains("email"));

    }


    @Test
    void update() {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setContactInfoId(4);
        contactInfo.setFirstName("Parrot");
        contactInfo.setLastName("Haver");
        contactInfo.setEmail("ph@bird.net");
        contactInfo.setPhoneNumber("123-456-7890");
        contactInfo.setStreetAddress("547 Aviary Place");
        contactInfo.setCity("Any Town");
        contactInfo.setState("MT");
        contactInfo.setZipCode("60646");

        when(repository.update(contactInfo)).thenReturn(true);
        Result<ContactInfo> result = service.update(contactInfo);
        assertTrue(result.isSuccess());

    }


}