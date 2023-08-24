package learn.petsitter.data;

import learn.petsitter.data.mappers.ContactInfoMapper;
import learn.petsitter.data.mappers.PetMapper;
import learn.petsitter.models.ContactInfo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class ContactInfoJdbcTemplateRepository implements ContactInfoRepository{
    private final JdbcTemplate jdbcTemplate;

    public ContactInfoJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this. jdbcTemplate = jdbcTemplate;
    }

    @Override
    public ContactInfo findById(int id) {
        final String sql = "select contact_info_id, first_name, last_name, email, phone_number, street_address, city, state, zipcode, lat, lng, contact_info.app_user_id " +
                "from contact_info " +
                "join app_user " +
                "on app_user.app_user_id = contact_info.app_user_id " +
                "where contact_info_id = ?;";

        return jdbcTemplate.query(sql, new ContactInfoMapper(), id).stream()
                .findFirst().orElse(null);
    }

    @Override
    public ContactInfo findByAppUserId(int appUserId) {
        final String sql = "select username, contact_info_id, first_name, last_name, email, phone_number, street_address, city, state, zipcode, lat, lng, contact_info.app_user_id " +
                "from contact_info " +
                "join app_user " +
                "on app_user.app_user_id = contact_info.app_user_id " +
                "where app_user.app_user_id = ?;";

        return jdbcTemplate.query(sql, new ContactInfoMapper(), appUserId).stream()
                .findFirst().orElse(null);
    }

    @Override
    public ContactInfo create(ContactInfo contactInfo) {
        final String sql = "insert into contact_info (first_name, last_name, email, phone_number, street_address, city, state, zipcode, lat, lng, app_user_id) "
                + " values (?,?,?,?,?,?,?,?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, contactInfo.getFirstName());
            ps.setString(2, contactInfo.getLastName());
            ps.setString(3, contactInfo.getEmail());
            ps.setString(4, contactInfo.getPhoneNumber());
            ps.setString(5, contactInfo.getStreetAddress());
            ps.setString(6, contactInfo.getCity());
            ps.setString(7, contactInfo.getState());
            ps.setString(8, contactInfo.getZipCode());
            ps.setDouble(9, contactInfo.getLatitude());
            ps.setDouble(10, contactInfo.getLongitude());
            ps.setInt(11, contactInfo.getAppUserId());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        contactInfo.setContactInfoId(keyHolder.getKey().intValue());
        return contactInfo;
    }

    @Override
    public boolean update(ContactInfo contactInfo) {
        final String sql = "update contact_info set " +
                "first_name = ?, " +
                "last_name = ?, " +
                "email = ?, " +
                "phone_number = ?, " +
                "street_address = ?, " +
                "city = ?, " +
                "state = ?, " +
                "zipcode = ?, " +
                "lat = ?, " +
                "lng = ? " +
                "where contact_info_id = ?;";

        int rowsUpdated = jdbcTemplate.update(sql,
                contactInfo.getFirstName(),
                contactInfo.getLastName(),
                contactInfo.getEmail(),
                contactInfo.getPhoneNumber(),
                contactInfo.getStreetAddress(),
                contactInfo.getCity(),
                contactInfo.getState(),
                contactInfo.getZipCode(),
                contactInfo.getLatitude(),
                contactInfo.getLongitude(),
                contactInfo.getContactInfoId());

        return rowsUpdated > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "delete from contact_info where contact_info_id = ?;";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
