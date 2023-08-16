package learn.petsitter.domain;

import learn.petsitter.data.PetRepository;
import learn.petsitter.models.Pet;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {
    private final PetRepository repository;

    public PetService(PetRepository repository) {
        this.repository = repository;
    }

    public List<Pet> findByUserId(int userId) {
        return repository.findByUserid(userId);
    }

    public Pet findById(int petId) {
        return repository.findById(petId);
    }

    public Result<Pet> create(Pet pet) {
        Result<Pet> result = validate(pet);
        if(!result.isSuccess()) {
            return result;
        }

        if (pet.getPetId() != 0) {
            result.addErrorMessage("petId cannot be set for 'create' operation in service", ResultType.INVALID);
            return result;
        }

        pet = repository.create(pet);
        result.setPayload(pet);
        return result;
    }

    public Result<Pet> update(Pet pet) {
        Result<Pet> result = validate(pet);

        if (pet.getPetId() <= 0) {
            result.addErrorMessage("Pet id is required in service update method", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(pet)) {
                result.setPayload(pet);
            } else {
                result.addErrorMessage("Pet id %s was not found in service update method", ResultType.NOT_FOUND, pet.getPetId());
            }
        }

        return result;
    }

    public Result<Pet> deleteById(int id) {
        Result<Pet> result = new Result<>();

        if(!repository.deleteById(id)) {
            result.addErrorMessage("Pet id %s was not found", ResultType.NOT_FOUND, id);
        }

        return result;
    }



    public Result<Pet> validate(Pet pet) {
        Result<Pet> result = new Result<>();

        if (pet == null) {
            result.addErrorMessage("pet cannot be null in service", ResultType.INVALID);
            return result;
        }

        if (pet.getName() == null || pet.getName().isBlank()) {
            result.addErrorMessage("pet name is required in service", ResultType.INVALID);
            return result;
        }

        if (pet.getPetType() == null || pet.getPetType().isBlank()) {
            result.addErrorMessage("petType is required in service", ResultType.INVALID);

            return result;
        }

        if (pet.getOwnerId() == 0) {
            result.addErrorMessage("pet ownerID required in service", ResultType.INVALID);
            return result;
        }

        return result;
    }
}
