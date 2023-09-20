package learn.petsitter.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class AppUser implements UserDetails {

    private int appUserId;
    private  String username;
    private  String password;
    private  boolean enabled;
    private  Collection<GrantedAuthority> authorities = List.of();
    private BigDecimal rate;
    private double distanceInKm;
    private String pfpUrl;
    private ContactInfo contactInfo;

    public AppUser() {}

    // For traditional users who don't sign in with Google OAuth. The password field is included.
    public AppUser(int appUserId, String username, String password, boolean enabled, BigDecimal rate, String pfpUrl, List<String> roles) {
        this.appUserId = appUserId;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.authorities = convertRolesToAuthorities(roles);
        this.rate = rate;
        this.pfpUrl = pfpUrl;
    }

    // For traditional users who include "distanceInKm" property
    public AppUser(int appUserId, String username, String password, boolean enabled, double distanceInKm, BigDecimal rate, String pfpUrl, List<String> roles) {
        this.appUserId = appUserId;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.distanceInKm = distanceInKm;
        this.authorities = convertRolesToAuthorities(roles);
        this.rate = rate;
        this.pfpUrl = pfpUrl;
    }

    // For Google OAuth users, no password is stored. Does not include distance property.
    public AppUser(int appUserId, String username, boolean enabled, BigDecimal rate, String pfpUrl, List <String> roles) {
        this.appUserId = appUserId;
        this.username = username;
        this.enabled = enabled;
        this.authorities = convertRolesToAuthorities(roles);
        this.rate = rate;
        this.pfpUrl = pfpUrl;
    }
    // For Google users. Includes distance property.
    public AppUser(int appUserId, String username, boolean enabled, double distanceInKm, BigDecimal rate, String pfpUrl, List <String> roles) {
        this.appUserId = appUserId;
        this.username = username;
        this.enabled = enabled;
        this.distanceInKm = distanceInKm;
        this.authorities = convertRolesToAuthorities(roles);
        this.rate = rate;
        this.pfpUrl = pfpUrl;
    }

    private static Collection<GrantedAuthority> convertRolesToAuthorities(List<String> roles) {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority(r))
                .collect(Collectors.toList());
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return new ArrayList<>(authorities);
    }

    @Override
    public String getPassword() {
        return password;
    }


//    public String getEmail() { return email; }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public String getPfpUrl() {
        return pfpUrl;
    }

    public void setPfpUrl(String pfpUrl) {
        this.pfpUrl = pfpUrl;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAuthorities(Collection<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public double getDistanceInKm() {
        return distanceInKm;
    }

    public void setDistanceInKm(double distanceInKm) {
        this.distanceInKm = distanceInKm;
    }

    public ContactInfo getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(ContactInfo contactInfo) {
        this.contactInfo = contactInfo;
    }
}

