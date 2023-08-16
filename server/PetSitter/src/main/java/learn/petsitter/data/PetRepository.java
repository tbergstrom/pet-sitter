package learn.petsitter.data;

import learn.petsitter.models.Pet;

import java.util.List;

public interface PetRepository {
    List<Pet> findByUserid(int userId);

    Pet findById(int id);

    Pet create(Pet pet);

    boolean update(Pet pet);

    boolean deleteById(int id);

}
