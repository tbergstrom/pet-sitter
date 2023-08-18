package learn.petsitter.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {
    // SecurityFilterChain allows configuring
    // web based security for specific http requests.
    private final JwtConverter converter;

    public SecurityConfig(JwtConverter converter) {
        this.converter = converter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationConfiguration authConfig) throws Exception {

        http.csrf().disable();

        http.cors();

        http.authorizeRequests()
                .antMatchers("/authenticate").permitAll()
                .antMatchers("/create_account").permitAll()
                .antMatchers("/create_account_g").permitAll() // added separate endpoint for google sign in
                .antMatchers("/refresh_token").authenticated()
                .antMatchers(HttpMethod.GET, "/api", "/api/pets", "/api/pets/pet/*", "/api/pets/*", "/api/pets/mypets", "/api/contact-info", "/api/contact-info/user/my-info","/api/contact-info/*", "api/visit/singlevisit/*").hasAnyAuthority("OWNER", "SITTER")
                .antMatchers(HttpMethod.GET, "/api/visit/owner", "/api/visit/owner/my-visits").hasAnyAuthority("OWNER")
                .antMatchers(HttpMethod.GET, "/api/visit/sitter", "/api/visit/sitter/my-visits").hasAnyAuthority("SITTER")
                .antMatchers(HttpMethod.POST,
                        "/api/pets", "/api/visit/owner", "/api/contact-info").hasAnyAuthority("OWNER")
                .antMatchers(HttpMethod.POST,
                        "/api/visit/sitter").hasAnyAuthority("SITTER")
                .antMatchers(HttpMethod.PUT,
                        "/api/pets", "/api/pets/pet/*", "/api/visit/owner", "/api/visit/sitter", "/api/contact-info/*", "api/visit/singlevisit/*").hasAnyAuthority("OWNER","SITTER")
                .antMatchers(HttpMethod.DELETE,
                        "/api/pets", "/api/pets/pet/*").hasAnyAuthority("OWNER")
                .antMatchers(HttpMethod.DELETE,
                        "/api/contact-info/*", "api/visit/singlevisit/*").hasAnyAuthority("OWNER", "SITTER")
                .antMatchers("/**").permitAll()
                .and()
                .addFilter(new JwtRequestFilter(authenticationManager(authConfig), converter))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}


