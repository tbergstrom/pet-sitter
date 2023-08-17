package learn.petsitter.data;

import learn.petsitter.data.mappers.PetMapper;
import learn.petsitter.models.Pet;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;


@Repository
public class PetJdbcTemplateRepository implements  PetRepository{

    private final JdbcTemplate jdbcTemplate;

    public PetJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this. jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Pet> findByUserid(int userId) {
        final String sql = "select pet_id, `name`, notes, pet_type, goes_walking, owner_id "
                + "from pet "
                + "where owner_id = ?;";

        return jdbcTemplate.query(sql, new PetMapper(), userId);
    }

    @Override
    public Pet findById(int id) {
        final String sql = "select pet_id, `name`, notes, pet_type, goes_walking, owner_id "
                + "from pet "
                + "where pet_id = ?;";

        return jdbcTemplate.query(sql, new PetMapper(), id).stream()
                .findFirst().orElse(null);
    }

    @Override
    public Pet create(Pet pet) {
        final String sql = "insert into pet (`name`, notes, pet_type, goes_walking, owner_id) "
                + " values (?,?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, pet.getName());
            ps.setString(2, pet.getNotes());
            ps.setString(3, pet.getPetType());
            ps.setBoolean(4, pet.isGoesWalking());
            ps.setInt(5, pet.getOwnerId());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        pet.setPetId(keyHolder.getKey().intValue());
        return pet;
    }

    @Override
    public boolean update(Pet pet) {
        final String sql = "update pet set " +
                "`name` = ?, " +
                "notes = ?, " +
                "pet_type = ?, " +
                "goes_walking = ?, " +
                "owner_id = ? " +
                "where pet_id = ?;";

        int rowsUpdated = jdbcTemplate.update(sql,
                pet.getName(),
                pet.getNotes(),
                pet.getPetType(),
                pet.isGoesWalking(),
                pet.getOwnerId(),
                pet.getPetId());

        return rowsUpdated > 0;
    }

    @Override
    public boolean deleteById(int petId) {
        final String sql = "delete from pet where pet_id = ?;";
        return jdbcTemplate.update(sql, petId) > 0;
    }
}
