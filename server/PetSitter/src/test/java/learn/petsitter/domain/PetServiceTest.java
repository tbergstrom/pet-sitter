package learn.petsitter.domain;

import learn.petsitter.data.PetRepository;
import learn.petsitter.models.Pet;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


import static org.mockito.Mockito.*;

@SpringBootTest()
class PetServiceTest {
    @Autowired
    PetService service;

    @MockBean
    PetRepository repository;

    @Test
    void findByUserId() {
        when(repository.findByUserid(1)).thenReturn(List.of(
                new Pet(1, "Sprinkle", "A happy little boy", "Cat", false, 1)
        ));

        List<Pet> pets = service.findByUserId(1);
        assertEquals(1, pets.size());
    }

    @Test
    void findById() {
        when(repository.findById(1)).thenReturn(new Pet());
        Pet pet = service.findById(1);
        assertNotNull(pet);
    }

    @Test
    void shouldNotCreateNullName() {
        Pet pet = new Pet();
        pet.setName(null);
        pet.setNotes("A gentle drooling giant");
        pet.setPetType("Dog");
        pet.setGoesWalking(true);
        pet.setOwnerId(1);

        when(repository.create(pet)).thenReturn(pet);
        Result<Pet> result = service.create(pet);

        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().size(), 1);
        assertTrue(result.getErrorMessages().get(0).contains("name"));
    }

    @Test
    void shouldCreate() {
        Pet pet = new Pet();
        pet.setName("Fluffy");
        pet.setNotes("A gentle drooling giant");
        pet.setPetType("Dog");
        pet.setGoesWalking(true);
        pet.setOwnerId(1);

        when(repository.create(pet)).thenReturn(pet);
        Result<Pet> result = service.create(pet);

        assertTrue(result.isSuccess());
        assertNotNull(result.getPayload());


    }

    @Test
    void shouldNotUpdateNullName() {
        Pet pet = new Pet();
        pet.setPetId(1);
        pet.setName(null);
        pet.setNotes("A gentle drooling giant");
        pet.setPetType("Dog");
        pet.setGoesWalking(true);
        pet.setOwnerId(1);

        Result<Pet> result = service.update(pet);

        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().size(), 1);
        assertTrue(result.getErrorMessages().get(0).contains("name"));
    }

    @Test
    void shouldUpdate() {
        Pet pet = new Pet();
        pet.setPetId(1);
        pet.setName("Fluffy");
        pet.setNotes("A gentle drooling giant");
        pet.setPetType("Dog");
        pet.setGoesWalking(true);
        pet.setOwnerId(1);

        when(repository.update(pet)).thenReturn(true);
        Result<Pet> result = service.update(pet);

        assertTrue(result.isSuccess());
    }

    @Test
    void deleteById() {
        when(repository.deleteById(1)).thenReturn(true);

        Result<Pet> result = service.deleteById(1);

        assertTrue(result.isSuccess());
    }

}