package learn.petsitter.data;

import learn.petsitter.models.Pet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;


import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PetJdbcTemplateRepositoryTest {
    @Autowired
    private PetJdbcTemplateRepository repository;

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
    void findByUserid() {
        List<Pet> result = repository.findByUserid(1);
        assertNotNull(result);
        assertTrue(result.size() >= 1);

        Pet pet = new Pet();
        pet.setPetId(1);
        pet.setName("Sprinkle");
        pet.setNotes("A happy little boy");
        pet.setPetType("Cat");
        pet.setGoesWalking(false);
        pet.setOwnerId(1);

        assertTrue(result.contains(pet));

    }

    @Test
    void findById() {
        Pet result = repository.findById(2);
        assertNotNull(result);
        assertEquals("Spot", result.getName());
    }

    @Test
    void shouldCreate() {
        Pet pet = new Pet();
        pet.setName("Fluffy");
        pet.setNotes("A gentle giant");
        pet.setPetType("Dog");
        pet.setGoesWalking(false);
        pet.setOwnerId(1);

        Pet result = repository.create(pet);

        assertNotNull(result);
        assertEquals(4, result.getPetId());

    }

    @Test
    void shouldUpdate() {
        Pet pet = new Pet();
        pet.setPetId(2);
        pet.setName("Spot");
        pet.setNotes("Eldery canine, walks slowly");
        pet.setPetType("Dog");
        pet.setGoesWalking(true);
        pet.setOwnerId(2);

        assertTrue(repository.update(pet));
        assertEquals("Eldery canine, walks slowly", repository.findById(2).getNotes());
    }

    @Test
    void deleteById() {
        assertTrue(repository.deleteById(3));

    }
}