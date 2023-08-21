package learn.petsitter.data;

import learn.petsitter.models.ContactInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;


import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ContactInfoJdbcTemplateRepositoryTest {
    @Autowired
    private ContactInfoJdbcTemplateRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    static boolean hasSetup = false;

    @BeforeEach
    void setup() {
        if (!hasSetup) {
            hasSetup = true;
            jdbcTemplate.update("call set_known_good_state();");
        }
    }

    @Test
    void findById() {
        ContactInfo result = repository.findById(3);
        assertNotNull(result);
        assertEquals("Finn", result.getFirstName());
    }

    @Test
    void findByAppUserId() {
        ContactInfo result = repository.findByAppUserId(1);
        assertNotNull(result);
        assertEquals("Doe", result.getLastName());
    }

    @Test
    void shouldUpdate() {
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

        assertTrue(repository.update(contactInfo));
        assertEquals("Parrot", repository.findById(4).getFirstName());
    }

}