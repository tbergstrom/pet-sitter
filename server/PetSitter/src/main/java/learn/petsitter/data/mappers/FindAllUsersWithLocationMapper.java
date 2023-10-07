package learn.petsitter.data.mappers;

import learn.petsitter.models.AppUser;
import learn.petsitter.models.ContactInfo;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class FindAllUsersWithLocationMapper implements RowMapper<AppUser> {

    @Override
    public AppUser mapRow(ResultSet rs, int i) throws SQLException {
        AppUser user = new AppUser();
        ContactInfo contactInfo = new ContactInfo();

        List<String> roleStrings = Arrays.asList(rs.getString("role").split(","));
        List<GrantedAuthority> roles = roleStrings.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        user.setAppUserId(rs.getInt("app_user_id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password_hash"));
        user.setEnabled(rs.getBoolean("enabled"));
        user.setDistanceInKm(rs.getDouble("distance"));
        user.setPfpUrl(rs.getString("pfp_url"));
        user.setRate(rs.getBigDecimal("rate"));
        user.setAuthorities(roles);

        contactInfo.setLatitude(rs.getDouble("lat"));
        contactInfo.setLongitude(rs.getDouble("lng"));

        user.setContactInfo(contactInfo); // Embed the contactInfo within the user object

        return user;
    }
}
