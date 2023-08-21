package learn.petsitter.data.mappers;

import learn.petsitter.App;
import learn.petsitter.models.AppUser;
import learn.petsitter.models.ContactInfo;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ContactInfoMapper implements RowMapper<ContactInfo> {
    @Override
    public ContactInfo mapRow(ResultSet resultSet, int i) throws SQLException {
        ContactInfo contactInfo = new ContactInfo();
        AppUser appUser = new AppUser();
        appUser.setUsername(resultSet.getString("username"));

        contactInfo.setContactInfoId(resultSet.getInt("contact_info_id"));
        contactInfo.setFirstName(resultSet.getString("first_name"));
        contactInfo.setLastName(resultSet.getString("last_name"));
        contactInfo.setEmail(resultSet.getString("email"));
        contactInfo.setPhoneNumber(resultSet.getString("phone_number"));
        contactInfo.setStreetAddress(resultSet.getString("street_address"));
        contactInfo.setCity(resultSet.getString("city"));
        contactInfo.setState(resultSet.getString("state"));
        contactInfo.setZipCode(resultSet.getString("zipcode"));
        contactInfo.setAppUserId(resultSet.getInt("app_user_id"));

        return contactInfo;
    }
}
