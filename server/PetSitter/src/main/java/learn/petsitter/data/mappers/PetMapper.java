package learn.petsitter.data.mappers;

import learn.petsitter.models.Pet;
import org.springframework.jdbc.core.RowMapper;


import java.sql.ResultSet;
import java.sql.SQLException;

public class PetMapper implements RowMapper<Pet> {

    @Override
    public Pet mapRow(ResultSet resultSet, int i) throws SQLException {
        Pet pet = new Pet();

        pet.setName(resultSet.getString("name"));
        pet.setPetType(resultSet.getString("pet_type"));
        pet.setNotes(resultSet.getString("notes"));

        return pet;
    }

}
